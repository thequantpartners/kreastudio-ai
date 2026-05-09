"use client";

import { useClerk } from "@clerk/nextjs";
import { MobileDashboard } from "@/components/ui/mobile-dashboard";

export default function DashboardPage() {
  const { signOut } = useClerk();

  return <MobileDashboard onLogout={() => signOut({ redirectUrl: "/" })} />;
}
