"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";
import { MobileDashboard } from "@/components/ui/mobile-dashboard";

type AppUser = {
  name: string | null;
  email: string | null;
  creditBalance: number;
};

export default function DashboardPage() {
  const { signOut } = useClerk();
  const { isLoaded, isSignedIn, user } = useUser();
  const [appUser, setAppUser] = useState<AppUser | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const controller = new AbortController();

    fetch("/api/me", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { user?: AppUser } | null) => {
        if (data?.user) setAppUser(data.user);
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("[dashboard] No se pudo sincronizar el usuario", error);
        }
      });

    return () => controller.abort();
  }, [isLoaded, isSignedIn]);

  const displayName = useMemo(() => {
    const clerkName = user?.fullName || user?.firstName || user?.username;
    const emailName = user?.primaryEmailAddress?.emailAddress?.split("@")[0];

    return appUser?.name || clerkName || emailName || "socio";
  }, [appUser?.name, user?.firstName, user?.fullName, user?.primaryEmailAddress?.emailAddress, user?.username]);

  return <MobileDashboard userName={displayName} onLogout={() => signOut({ redirectUrl: "/" })} />;
}
