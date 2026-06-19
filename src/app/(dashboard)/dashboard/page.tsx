import type { Metadata } from "next";
import { auth } from "@/shared/lib/auth";
import { DashboardClient } from "./DashboardClient";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  const userName = session?.user?.name?.split(" ")[0] ?? "there";
  return <DashboardClient userName={userName} />;
}
