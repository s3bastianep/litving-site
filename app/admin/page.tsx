import type { Metadata } from "next";
import { AdminApp } from "../components/admin-app";
import "../admin.css";

export const metadata: Metadata = {
  title: "Admin | LITVING",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return <AdminApp />;
}
