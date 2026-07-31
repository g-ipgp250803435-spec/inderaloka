export type LinkItem = {
  label: string;
  href: string;
};

export type SiteSettings = {
  name: string;
  shortName: string;
  portalTitle: string;
  tagline: string;
  description: string;
  logo: string;
  favicon: string;
  primaryColor: string;
  accentColor: string;
  officialDomain: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  emergency: {
    enabled: boolean;
    level: "info" | "warning" | "critical";
    title: string;
    message: string;
    href: string;
  };
};

export type Service = {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  href: string;
  popular?: boolean;
};

export type NewsItem = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  ministry: string;
  body: string[];
  featured?: boolean;
};

export type Ministry = {
  slug: string;
  name: string;
  shortName: string;
  minister: string;
  portfolio: string;
  description: string;
  icon: string;
  website?: string;
};

export type DocumentItem = {
  id: string;
  title: string;
  category: string;
  date: string;
  format: string;
  size: string;
  href: string;
};

export type CustomPage = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  showInNav: boolean;
  navLabel: string;
  sections: Array<{
    heading: string;
    body: string[];
    bullets?: string[];
  }>;
};

export type CabinetMember = {
  name: string;
  role: string;
  portfolio: string;
};

export type SiteContent = {
  site: SiteSettings;
  navigation: LinkItem[];
  home: {
    eyebrow: string;
    heroTitle: string;
    heroText: string;
    primaryCta: LinkItem;
    secondaryCta: LinkItem;
    stats: Array<{ value: string; label: string }>;
    priorities: Array<{ title: string; description: string; icon: string }>;
    messageTitle: string;
    messageBody: string;
  };
  services: Service[];
  news: NewsItem[];
  ministries: Ministry[];
  documents: DocumentItem[];
  cabinet: CabinetMember[];
  pages: CustomPage[];
};
