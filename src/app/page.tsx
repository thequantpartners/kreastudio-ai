"use client";

import { useEffect, useRef, useState } from "react";
import { PolaroidFlickThrough } from "@/components/ui/polaroid-flick-through";

type Slide = {
  eyebrow: string;
  title: string;
  copy: string;
  stat: string;
};

const slides: Slide[] = [
  {
    eyebrow: "AI Content Engine",
    title: "Crea 30 días de contenido en minutos",
    copy: "Sube una foto o descripción. Recibe imágenes, copys, ads y posts listos para vender.",
    stat: "30 posts listos",
  },
  {
    eyebrow: "Resultados",
    title: "Esto es lo que recibes al generar",
    copy: "Una galería de creatives lista para stories, posts, anuncios y campañas mensuales.",
    stat: "5 estilos visuales",
  },
];

function VisualStack() {
  const cards = [
    {
      label: "Launch",
      x: "left-0 top-8",
      rotate: "-rotate-6",
      z: "z-30",
      bg: "bg-[radial-gradient(circle_at_30%_18%,#fff6,transparent_16%),linear-gradient(135deg,#3b0a0a,#ff2b2b_48%,#f97316)]",
    },
    {
      label: "Story",
      x: "left-[68px] top-2",
      rotate: "-rotate-2",
      z: "z-40",
      bg: "bg-[radial-gradient(circle_at_48%_22%,#fff8,transparent_15%),linear-gradient(135deg,#06101f,#2563eb_42%,#ff2b2b)]",
    },
    {
      label: "Ads",
      x: "right-0 top-10",
      rotate: "rotate-6",
      z: "z-20",
      bg: "bg-[radial-gradient(circle_at_70%_20%,#fff,transparent_13%),linear-gradient(135deg,#121212,#7f1d1d_48%,#facc15)]",
    },
  ];

  return (
    <div className="relative mx-auto mt-8 h-[34dvh] min-h-[230px] w-full max-w-[340px]">
      <div className="absolute inset-x-0 top-20 h-px bg-[linear-gradient(90deg,transparent,#ff2b2b66,transparent)]" />
      <div className="absolute inset-x-8 top-2 h-56 rounded-full bg-[#ff2b2b]/18 blur-3xl" />

      <div className="absolute left-1/2 top-0 h-[205px] w-[205px] -translate-x-1/2">
        {cards.map((card, index) => (
          <div
            key={card.label}
            className={`gallery-card absolute h-[188px] w-[142px] overflow-hidden rounded-[26px] border border-white/12 ${card.bg} ${card.x} ${card.rotate} ${card.z} shadow-[0_28px_70px_rgba(0,0,0,.52)]`}
            style={{ animationDelay: `${index * 120}ms` }}
          >
            <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2 py-1 text-[9px] font-black uppercase text-white/78 backdrop-blur">
              {card.label}
            </span>
            <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-black/42 p-3 backdrop-blur">
              <div className="h-1.5 rounded-full bg-white/58" />
              <div className="mt-2 h-1.5 w-2/3 rounded-full bg-white/25" />
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-7 right-7 border border-white/10 bg-[#111119]/90 p-4 shadow-[0_24px_60px_rgba(0,0,0,.55)] backdrop-blur-xl">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff3b30]">Campaign Pack</p>
        <p className="mt-2 text-sm font-black">30 posts + 30 copys</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {["Hook", "Copy", "CTA"].map((item) => (
            <div key={item} className="bg-white/8 px-2 py-2">
              <p className="text-[9px] font-bold uppercase text-white/45">{item}</p>
              <div className="mt-2 h-1.5 bg-white/24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SwipeControl({
  label,
  onComplete,
}: Readonly<{
  label: string;
  onComplete: () => void;
}>) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [x, setX] = useState(0);
  const max = 214;
  const threshold = 0.72;

  function commit(nextX: number) {
    const clamped = Math.max(0, Math.min(max, nextX));
    setX(clamped);
  }

  function finish() {
    setDragging(false);
    if (x / max >= threshold) {
      setX(max);
      window.setTimeout(() => {
        onComplete();
        setX(0);
      }, 140);
    } else {
      setX(0);
    }
  }

  return (
    <div
      ref={trackRef}
      role="button"
      tabIndex={0}
      aria-label={label}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === "ArrowRight") onComplete();
      }}
      onPointerDown={(event) => {
        setDragging(true);
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!dragging || !trackRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();
        commit(event.clientX - rect.left - 29);
      }}
      onPointerUp={finish}
      onPointerCancel={finish}
      className="relative mx-auto h-[66px] w-full max-w-[326px] touch-none overflow-hidden rounded-full border border-white/20 bg-[linear-gradient(135deg,rgba(255,255,255,.34),rgba(255,255,255,.10)_42%,rgba(120,170,220,.18))] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,.38),inset_0_-18px_42px_rgba(0,0,0,.18),0_22px_54px_rgba(0,0,0,.42)] backdrop-blur-[26px] outline-none"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,.42),transparent_24%),linear-gradient(90deg,rgba(120,190,255,.24),transparent_55%)]" />
      <div className="swipe-sheen pointer-events-none absolute inset-y-0 -left-24 w-24 rotate-12 bg-white/24 blur-xl" />
      <div
        className="absolute inset-y-1.5 left-1.5 rounded-full bg-white/18 transition-[width]"
        style={{ width: `${58 + x}px` }}
      />
      <div className="absolute inset-0 grid place-items-center pl-10 pr-16 text-sm font-semibold text-white/82">
        {label}
      </div>
      <div className="swipe-chevrons absolute right-5 top-1/2 flex -translate-y-1/2 gap-1 text-lg font-black text-white/45">
        <span>›</span>
        <span>›</span>
      </div>
      <div
        className="swipe-knob absolute left-1.5 top-1.5 grid size-[54px] place-items-center rounded-full bg-[linear-gradient(145deg,#ffffff,#dff1ff)] text-xl font-black text-black shadow-[inset_0_1px_0_rgba(255,255,255,.8),0_10px_30px_rgba(0,0,0,.35),0_0_0_1px_rgba(255,255,255,.35)]"
        style={{ transform: `translateX(${x}px)`, transition: dragging ? "none" : "transform 180ms ease" }}
      >
        ✓
      </div>
    </div>
  );
}

export default function Page() {
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  useEffect(() => {
    document.documentElement.classList.add("no-scroll-deck");
    document.body.classList.add("no-scroll-deck");
    return () => {
      document.documentElement.classList.remove("no-scroll-deck");
      document.body.classList.remove("no-scroll-deck");
    };
  }, []);

  return (
    <main className="h-dvh overflow-hidden bg-[#050509] text-white">
      <div className="relative mx-auto h-dvh w-full max-w-[430px] overflow-hidden bg-[#050509]">
        <div className="absolute left-[-120px] top-[-90px] size-72 rounded-full bg-[#ff2b2b]/26 blur-3xl" />
        <div className="absolute right-[-130px] top-36 size-80 rounded-full bg-orange-600/18 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,transparent,#050509_70%)]" />

        <section className="relative flex h-dvh flex-col px-5 pb-5 pt-4">
          <nav className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white/72">KreaStudio AI</span>
            <span className="h-6 w-6" />
          </nav>

          <div className="flex min-h-0 flex-1 flex-col justify-center pb-4 text-center">
            <p className="mx-auto w-fit border border-[#ff2b2b]/35 bg-[#ff2b2b]/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-[#ff5a4f]">
              {slide.eyebrow}
            </p>
            <h1 className="mx-auto mt-5 max-w-[340px] text-[34px] font-black leading-[1.02] tracking-[-0.045em]">
              {slide.title}
            </h1>
            <p className="mx-auto mt-4 max-w-[314px] text-[12px] leading-5 text-white/62">{slide.copy}</p>
            {index === 0 ? <VisualStack /> : <PolaroidFlickThrough />}
            <div className="mx-auto mt-5 grid w-full max-w-[326px] grid-cols-3 gap-2">
              <div className="border border-white/10 bg-[#111119] px-2 py-3">
                <p className="text-[15px] font-black">10x</p>
                <p className="mt-1 text-[9px] uppercase text-white/42">rápido</p>
              </div>
              <div className="border border-white/10 bg-[#111119] px-2 py-3">
                <p className="text-[15px] font-black">30</p>
                <p className="mt-1 text-[9px] uppercase text-white/42">días</p>
              </div>
              <div className="border border-white/10 bg-[#111119] px-2 py-3">
                <p className="text-[15px] font-black">1</p>
                <p className="mt-1 text-[9px] uppercase text-white/42">swipe</p>
              </div>
            </div>
          </div>

          <SwipeControl
            label={index === slides.length - 1 ? "Crear mi contenido" : "Desliza para avanzar"}
            onComplete={() => setIndex((current) => Math.min(current + 1, slides.length - 1))}
          />
        </section>
      </div>
    </main>
  );
}
