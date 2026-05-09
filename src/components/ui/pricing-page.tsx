"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { BriefcaseBusiness, Building2, Check, Sparkles } from "lucide-react";

type PricingPlan = {
  id: "starter" | "pro" | "agency";
  planName: string;
  description: string;
  price: string;
  priceDescription: string;
  features: string[];
  icon: React.ElementType;
  isPopular: boolean;
  buttonText: string;
};

const plans: PricingPlan[] = [
  {
    id: "starter",
    planName: "Starter",
    description: "Para probar el flujo",
    price: "$0",
    priceDescription: "inicio",
    icon: Sparkles,
    features: ["5 piezas de prueba", "Ideas de posts", "Estilos basicos", "Exportacion manual"],
    buttonText: "Empezar gratis",
    isPopular: false,
  },
  {
    id: "pro",
    planName: "Pro",
    description: "Para publicar cada semana",
    price: "$29",
    priceDescription: "/ mes",
    icon: BriefcaseBusiness,
    features: ["30 posts mensuales", "Copys y anuncios", "Stories y carruseles", "Soporte prioritario"],
    buttonText: "Activar Pro",
    isPopular: true,
  },
  {
    id: "agency",
    planName: "Agency",
    description: "Para equipos y marcas",
    price: "$50",
    priceDescription: "USD",
    icon: Building2,
    features: ["Todo en Pro", "Multiples marcas", "Flujos a medida", "Acompanamiento"],
    buttonText: "Hablar con ventas",
    isPopular: false,
  },
];

function PricingCard({
  plan,
  onStartFree,
  onCheckout,
  checkoutError,
  isCheckingOut,
}: Readonly<{
  plan: PricingPlan;
  onStartFree?: () => void;
  onCheckout: (packId: PricingPlan["id"]) => void;
  checkoutError: string;
  isCheckingOut: boolean;
}>) {
  const Icon = plan.icon;

  return (
    <div className="relative mx-auto flex h-full min-h-0 w-full max-w-[356px] flex-col overflow-hidden rounded-[24px] border border-white/12 bg-[#111119] px-4 py-4 text-left shadow-[0_28px_80px_rgba(0,0,0,.54),inset_0_1px_0_rgba(255,255,255,.08)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(255,255,255,.12),transparent_32%),radial-gradient(circle_at_100%_22%,rgba(255,60,45,.24),transparent_42%),linear-gradient(135deg,rgba(255,255,255,.055),transparent_48%,rgba(255,102,0,.08))]" />
      <div className="pointer-events-none absolute bottom-[-28%] left-[8%] h-[54%] w-[84%] rounded-full bg-[#ff2b2b]/16 blur-3xl" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-[14px] border border-[#ff5a4f]/28 bg-[#ff2b2b]/12 text-[#ff6b61] shadow-[inset_0_1px_0_rgba(255,255,255,.12)]">
            <Icon size={22} strokeWidth={2.2} />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[19px] font-black leading-none text-white">{plan.planName}</span>
            <span className="mt-1 block truncate text-[11px] font-semibold text-white/46">{plan.description}</span>
          </span>
        </div>
        {plan.isPopular ? (
          <span className="shrink-0 rounded-full bg-[#ff3b2f] px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.12em] text-white shadow-[0_10px_26px_rgba(255,59,47,.36)]">
            Popular
          </span>
        ) : null}
      </div>

      <div className="relative mt-4 flex items-end gap-2 border-b border-white/10 pb-4">
        <span className="text-[clamp(34px,10vw,44px)] font-black leading-none text-white">{plan.price}</span>
        <span className="pb-1 text-[12px] font-semibold text-white/48">{plan.priceDescription}</span>
      </div>

      <ul className="relative mt-4 grid min-h-0 flex-1 content-start gap-2.5 overflow-hidden">
        {plan.features.map((feature) => (
          <li key={feature} className="flex min-w-0 items-start gap-2.5 text-[12px] font-medium leading-[1.35] text-white/72">
            <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-white text-[#111119]">
              <Check size={11} strokeWidth={4} />
            </span>
            <span className="min-w-0">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={plan.planName === "Starter" ? onStartFree : () => onCheckout(plan.id)}
        disabled={isCheckingOut}
        className="relative mt-4 h-12 w-full rounded-[14px] bg-white text-[13px] font-black text-[#111119] shadow-[0_18px_36px_rgba(255,255,255,.16)] transition-colors hover:bg-white/88 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isCheckingOut && plan.planName !== "Starter" ? "Abriendo pago..." : plan.buttonText}
      </button>
      {checkoutError ? <p className="relative mt-3 text-center text-[11px] font-semibold leading-4 text-[#ffb5af]">{checkoutError}</p> : null}
    </div>
  );
}

export default function PricingPage({ onStartFree }: Readonly<{ onStartFree?: () => void }>) {
  const { isLoaded, isSignedIn } = useUser();
  const [activeIndex, setActiveIndex] = useState(1);
  const [checkoutError, setCheckoutError] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const activePlan = plans[activeIndex];

  async function startCheckout(packId: PricingPlan["id"]) {
    setCheckoutError("");

    if (isLoaded && !isSignedIn) {
      onStartFree?.();
      return;
    }

    setIsCheckingOut(true);

    try {
      const response = await fetch("/api/payments/mercado-pago/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId }),
      });
      const data = (await response.json()) as { checkout?: { checkoutUrl?: string }; message?: string };

      if (!response.ok || !data.checkout?.checkoutUrl) {
        throw new Error(data.message ?? "No se pudo abrir Mercado Pago.");
      }

      window.location.href = data.checkout.checkoutUrl;
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : "No se pudo abrir Mercado Pago.");
    } finally {
      setIsCheckingOut(false);
    }
  }

  return (
    <div className="relative mx-auto mt-[clamp(14px,2.2svh,22px)] flex h-[min(43svh,392px)] min-h-[318px] w-full max-w-full flex-col overflow-hidden">
      <div className="absolute inset-x-[-6%] top-[18%] h-[70%] rounded-full bg-[#ff3b2f]/18 blur-3xl" />

      <div className="relative mb-3 grid h-11 shrink-0 grid-cols-3 rounded-full border border-white/10 bg-white/[0.055] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,.1)] backdrop-blur-xl">
        {plans.map((plan, index) => (
          <button
            type="button"
            key={plan.planName}
            onClick={() => setActiveIndex(index)}
            className={`min-w-0 rounded-full px-2 text-[11px] font-black transition-colors ${
              activeIndex === index ? "bg-white text-[#111119]" : "text-white/48 hover:text-white/78"
            }`}
          >
            <span className="block truncate">{plan.planName}</span>
          </button>
        ))}
      </div>

      <div className="relative min-h-0 flex-1">
        <PricingCard
          plan={activePlan}
          onStartFree={onStartFree}
          onCheckout={startCheckout}
          checkoutError={checkoutError}
          isCheckingOut={isCheckingOut}
        />
      </div>
    </div>
  );
}
