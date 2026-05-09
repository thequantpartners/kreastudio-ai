"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Component as SignInCard } from "@/components/ui/sign-in-card-2";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { fetchStatus, signIn } = useSignIn();
  const [error, setError] = useState("");

  async function signInWithGoogle() {
    if (fetchStatus === "fetching") return;

    setError("");

    try {
      const { error: signInError } = await signIn.create({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        actionCompleteRedirectUrl: searchParams.get("redirect_url") || "/dashboard",
        signUpIfMissing: true,
      });

      if (signInError) {
        throw new Error(signInError.longMessage || signInError.message);
      }

      const redirectUrl = signIn.firstFactorVerification.externalVerificationRedirectURL;

      if (!redirectUrl) {
        throw new Error("Clerk no devolvio una URL de autenticacion con Google.");
      }

      window.location.href = redirectUrl.toString();
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "No se pudo iniciar sesion con Google.");
    }
  }

  return (
    <main className="h-[100svh] w-full overflow-hidden bg-black text-white md:h-dvh">
      <div className="relative mx-auto h-[100svh] w-full max-w-full overflow-hidden bg-black md:h-dvh md:max-w-[430px]">
        <SignInCard onBack={() => router.push("/")} onContinue={signInWithGoogle} />
        {error ? (
          <p className="absolute inset-x-6 bottom-6 z-20 rounded-[8px] border border-[#ff5a4f]/24 bg-[#ff5a4f]/10 px-3 py-2 text-center text-[11px] font-bold leading-5 text-[#ffb5af]">
            {error}
          </p>
        ) : null}
      </div>
    </main>
  );
}
