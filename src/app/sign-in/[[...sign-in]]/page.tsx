"use client";

import { useAuth, useSignIn } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Component as SignInCard } from "@/components/ui/sign-in-card-2";

function getSafeRedirectTarget(redirectUrl: string | null) {
  if (!redirectUrl) return "/dashboard";

  if (redirectUrl.startsWith("/") && !redirectUrl.startsWith("//")) {
    return redirectUrl;
  }

  try {
    const url = new URL(redirectUrl);

    if (url.origin === window.location.origin) {
      return `${url.pathname}${url.search}${url.hash}`;
    }
  } catch {
    return "/dashboard";
  }

  return "/dashboard";
}

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoaded, isSignedIn } = useAuth();
  const { fetchStatus, signIn } = useSignIn();
  const [error, setError] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const redirectTarget = useMemo(
    () => getSafeRedirectTarget(searchParams.get("redirect_url")),
    [searchParams]
  );

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace(redirectTarget);
    }
  }, [isLoaded, isSignedIn, redirectTarget, router]);

  async function signInWithGoogle() {
    if (fetchStatus === "fetching" || isRedirecting) return;

    if (isSignedIn) {
      router.replace(redirectTarget);
      return;
    }

    setError("");
    setIsRedirecting(true);

    try {
      const { error: signInError } = await signIn.create({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        actionCompleteRedirectUrl: redirectTarget,
        signUpIfMissing: true,
      });

      if (signInError) {
        throw new Error(signInError.longMessage || signInError.message);
      }

      const redirectUrl = signIn.firstFactorVerification.externalVerificationRedirectURL;

      if (!redirectUrl) {
        throw new Error("Clerk no devolvio una URL de autenticacion con Google.");
      }

      window.location.assign(redirectUrl.toString());
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "No se pudo iniciar sesion con Google.");
      setIsRedirecting(false);
    }
  }

  return (
    <main className="h-[100svh] w-full overflow-hidden bg-black text-white md:h-dvh">
      <div className="relative mx-auto h-[100svh] w-full max-w-full overflow-hidden bg-black md:h-dvh md:max-w-[430px]">
        <SignInCard
          isLoading={!isLoaded || fetchStatus === "fetching" || isRedirecting}
          onBack={() => router.push("/")}
          onContinue={signInWithGoogle}
        />
        {error ? (
          <p className="absolute inset-x-6 bottom-6 z-20 rounded-[8px] border border-[#ff5a4f]/24 bg-[#ff5a4f]/10 px-3 py-2 text-center text-[11px] font-bold leading-5 text-[#ffb5af]">
            {error}
          </p>
        ) : null}
      </div>
    </main>
  );
}
