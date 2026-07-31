type GitHubConfig = {
  token: string;
  owner: string;
  repo: string;
  branch: string;
};

export function getGitHubConfig(): GitHubConfig | null {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  if (!token || !owner || !repo) return null;
  return { token, owner, repo, branch };
}

function headers(token: string) {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json"
  };
}

export async function commitFile(path: string, contentBase64: string, message: string) {
  const config = getGitHubConfig();
  if (!config) {
    return { ok: false as const, reason: "configuration_missing" as const };
  }

  const endpoint = `https://api.github.com/repos/${config.owner}/${config.repo}/contents/${path}`;
  const current = await fetch(`${endpoint}?ref=${encodeURIComponent(config.branch)}`, {
    headers: headers(config.token),
    cache: "no-store"
  });

  let sha: string | undefined;
  if (current.ok) {
    const currentFile = (await current.json()) as { sha?: string };
    sha = currentFile.sha;
  } else if (current.status !== 404) {
    const detail = await current.text();
    throw new Error(`GitHub read failed (${current.status}): ${detail}`);
  }

  const response = await fetch(endpoint, {
    method: "PUT",
    headers: headers(config.token),
    body: JSON.stringify({
      message,
      content: contentBase64,
      branch: config.branch,
      ...(sha ? { sha } : {})
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`GitHub publish failed (${response.status}): ${detail}`);
  }

  const result = (await response.json()) as {
    commit?: { html_url?: string };
    content?: { path?: string };
  };

  return {
    ok: true as const,
    commitUrl: result.commit?.html_url,
    path: result.content?.path
  };
}
