import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { AdminStudio } from "@/components/AdminStudio";

export const metadata: Metadata = { title: "Content Studio", robots: { index: false, follow: false } };

export default function AdminPage() {
  return <div className="admin-page"><AdminStudio initialContent={getContent()}/></div>;
}
