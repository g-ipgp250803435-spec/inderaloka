import type { ReactNode, SVGProps } from "react";

const paths: Record<string, ReactNode> = {
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
  close: <><path d="m6 6 12 12M18 6 6 18"/></>,
  chevron: <path d="m9 18 6-6-6-6"/>,
  shield: <path d="M12 3 20 7v5c0 5-3.4 8.3-8 10-4.6-1.7-8-5-8-10V7l8-4Z"/>,
  growth: <><path d="M4 18V6M4 18h16"/><path d="m7 14 4-4 3 3 5-6"/></>,
  people: <><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2"/><path d="M3 20c0-4 2.7-7 6-7s6 3 6 7M15 15c3 0 5 2 5 5"/></>,
  passport: <><rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="11" r="3"/><path d="M9 16h6"/></>,
  building: <><path d="M4 21V8l8-5 8 5v13M8 21v-5h8v5M8 10h.01M12 10h.01M16 10h.01"/></>,
  wallet: <><path d="M4 7a2 2 0 0 1 2-2h12v14H6a2 2 0 0 1-2-2V7Z"/><path d="M16 10h4v4h-4a2 2 0 0 1 0-4Z"/></>,
  health: <><path d="M12 21s-7-4.3-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.7-7 10-7 10Z"/><path d="M9 12h6M12 9v6"/></>,
  book: <><path d="M4 5a3 3 0 0 1 3-2h5v16H7a3 3 0 0 0-3 2V5ZM20 5a3 3 0 0 0-3-2h-5v16h5a3 3 0 0 1 3 2V5Z"/></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V4h8v3M3 12h18M10 12v2h4v-2"/></>,
  home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v11h14V10M9 21v-7h6v7"/></>,
  message: <><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"/><path d="M8 9h8M8 13h5"/></>,
  globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></>,
  spark: <><path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/></>,
  leaf: <><path d="M20 4C11 4 5 8 5 15c0 3 2 5 5 5 7 0 10-7 10-16Z"/><path d="M5 20c3-5 7-8 12-10"/></>,
  file: <><path d="M6 2h8l4 4v16H6V2Z"/><path d="M14 2v5h5M9 13h6M9 17h6"/></>,
  download: <><path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
  external: <><path d="M14 4h6v6M20 4l-9 9"/><path d="M18 13v6H5V6h6"/></>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
  moon: <path d="M20 15.5A8 8 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z"/>,
  text: <><path d="M4 7V4h16v3M9 20h6M12 4v16"/></>,
  lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
  upload: <><path d="M12 21V9M7 14l5-5 5 5"/><path d="M5 3h14"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14"/></>,
  save: <><path d="M5 3h12l2 2v16H5V3Z"/><path d="M8 3v6h8V3M8 21v-7h8v7"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  code: <><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/></>
};

export function Icon({ name, size = 22, ...props }: SVGProps<SVGSVGElement> & { name: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name] ?? paths.spark}
    </svg>
  );
}
