"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

const MobileDashboard = dynamic(
  () => import("@/components/ui/mobile-dashboard").then((module) => module.MobileDashboard),
  {
    ssr: false,
    loading: () => <DashboardLoadingShell />,
  }
);

type AppUser = {
  name: string | null;
  email: string | null;
  creditBalance: number;
};

function DashboardLoadingShell() {
  return (
    <main className="h-[100svh] w-full overflow-hidden bg-[#10071d] text-white md:h-dvh">
      <div className="relative mx-auto grid h-[100svh] w-full max-w-full grid-rows-[minmax(0,1fr)_auto] overflow-hidden bg-[linear-gradient(180deg,#1a1328_0%,#141520_45%,#0c0d13_100%)] px-[clamp(16px,5vw,22px)] pb-[max(14px,env(safe-area-inset-bottom))] pt-5 md:h-dvh md:max-w-[430px]">
        <div className="pointer-events-none absolute left-[-110px] top-[-80px] size-60 rounded-full bg-[#7b4dff]/20" />
        <div className="pointer-events-none absolute right-[-96px] top-24 size-52 rounded-full bg-[#f8582f]/12" />
        <div className="relative z-10 space-y-4">
          <div className="h-28 rounded-[8px] border border-white/10 bg-white/[0.06] p-4">
            <div className="h-3 w-24 rounded-full bg-[#ffd166]/40" />
            <div className="mt-4 h-7 w-56 max-w-full rounded-full bg-white/14" />
            <div className="mt-3 h-3 w-36 rounded-full bg-white/10" />
          </div>
          <div className="h-24 rounded-[8px] border border-[#ffd166]/18 bg-[#f8582f]/10 p-4">
            <div className="h-3 w-28 rounded-full bg-[#ffd166]/35" />
            <div className="mt-4 h-5 w-40 rounded-full bg-white/12" />
          </div>
          <div className="space-y-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-14 rounded-[8px] border border-white/8 bg-white/[0.045]" />
            ))}
          </div>
        </div>
        <nav className="relative z-20 grid h-[58px] shrink-0 grid-cols-5 items-center rounded-full border border-white/12 bg-[linear-gradient(135deg,rgba(99,81,145,.9),rgba(59,49,90,.96))] px-2">
          {[0, 1, 2, 3, 4].map((item) => (
            <span key={item} className="mx-auto size-8 rounded-full bg-white/10" />
          ))}
        </nav>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  const { signOut } = useClerk();
  const { isLoaded, isSignedIn, user } = useUser();
  const [appUser, setAppUser] = useState<AppUser | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const controller = new AbortController();
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let idleId: number | undefined;

    const syncUser = () => {
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
    };

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(syncUser, { timeout: 1200 });
    } else {
      timeoutId = setTimeout(syncUser, 120);
    }

    return () => {
      controller.abort();
      if (idleId) window.cancelIdleCallback(idleId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoaded, isSignedIn]);

  const displayName = useMemo(() => {
    const clerkName = user?.fullName || user?.firstName || user?.username;
    const emailName = user?.primaryEmailAddress?.emailAddress?.split("@")[0];

    return appUser?.name || clerkName || emailName || "socio";
  }, [appUser?.name, user?.firstName, user?.fullName, user?.primaryEmailAddress?.emailAddress, user?.username]);

  return <MobileDashboard userName={displayName} onLogout={() => signOut({ redirectUrl: "/" })} />;
}
