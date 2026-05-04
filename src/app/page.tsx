"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, X } from "lucide-react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { Component as ImageAutoSlider } from "@/components/ui/image-auto-slider";
import InteractiveSelector from "@/components/ui/interactive-selector";
import PricingPage from "@/components/ui/pricing-page";
import { Component as TypewriterTestimonial } from "@/components/ui/typewriter-testimonial";

type Slide = {
  eyebrow: string;
  title: string;
  copy: string;
  stat: string;
  visual: "slider" | "selector" | "video" | "pricing";
  titleClass: string;
};

const slides: Slide[] = [
  {
    eyebrow: "AI Content Engine",
    title: "Crea 30 días de contenido en minutos",
    copy: "Sube una foto o descripción. Recibe imágenes, copys, ads y posts listos para vender.",
    stat: "30 posts listos",
    visual: "slider",
    titleClass: "text-[clamp(36px,10vw,50px)]",
  },
  {
    eyebrow: "Resultados",
    title: "Esto es lo que recibes al generar",
    copy: "Una galería de creatives lista para stories, posts, anuncios y campañas mensuales.",
    stat: "5 estilos visuales",
    visual: "selector",
    titleClass: "text-[clamp(36px,9.8vw,50px)]",
  },
  {
    eyebrow: "Demo en video",
    title: "Mira como funciona en menos de 3 minutos",
    copy: "Ve el flujo completo: sube tu idea, elige estilo y recibe piezas listas para publicar sin salir del celular.",
    stat: "2:57 demo",
    visual: "video",
    titleClass: "text-[clamp(30px,8.6vw,42px)]",
  },
  {
    eyebrow: "Pagos",
    title: "Elige el plan y empieza a publicar",
    copy: "Paga solo por el volumen que necesitas. Cambia de plan cuando tu contenido empiece a escalar.",
    stat: "3 planes",
    visual: "pricing",
    titleClass: "text-[clamp(29px,8.2vw,40px)]",
  },
];

const swipeLabels = [
  "Ver lo que obtendre",
  "Ver demo",
  "Crear mi contenido",
];

const demoVideoUrl =
  "https://res.cloudinary.com/dvixq2oge/video/upload/v1774233295/WhatsApp_Video_2026-02-08_at_14.08.20_jsdv4g.mp4";

const testimonials = [
  {
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    text: "Me entrego ideas para todo el mes y pude publicar sin abrir cinco herramientas distintas.",
    name: "Nicolas",
    jobtitle: "Real estate",
  },
  {
    image:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    text: "Subi una foto del producto y salieron posts, copies y anuncios listos para probar.",
    name: "Camila",
    jobtitle: "Ecommerce",
  },
  {
    image:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    text: "Lo mejor es que el resultado ya viene con estilo de campana, no como imagen generica.",
    name: "Alex",
    jobtitle: "Agencia ads",
  },
  {
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    text: "En minutos tenia variaciones para stories, reels y captions. Me ahorro una tarde completa.",
    name: "Sarah",
    jobtitle: "Food brand",
  },
];

function formatClock(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "00:00";
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

function VideoReelsPlayer({ onFinished }: Readonly<{ onFinished: () => void }>) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [userStartedPlayback, setUserStartedPlayback] = useState(false);
  const [immersive, setImmersive] = useState(false);

  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  async function activateSound() {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    setCurrentTime(0);

    video.muted = false;
    setMuted(false);

    try {
      await video.play();
      setUserStartedPlayback(true);
      setImmersive(true);
    } catch {
      video.muted = true;
      setMuted(true);
      setUserStartedPlayback(false);
      setImmersive(false);
    }
  }

  return (
    <div
      className={
        immersive
          ? "fixed inset-0 z-50 mx-0 mt-0 h-[100svh] w-screen bg-black md:h-dvh"
          : "relative mx-auto mt-[clamp(28px,4.5svh,48px)] w-fit"
      }
    >
      <div
        className={
          immersive
            ? "hidden"
            : "absolute -inset-5 rounded-[34px] bg-[radial-gradient(circle_at_50%_18%,rgba(255,70,58,.26),transparent_62%)] blur-2xl"
        }
      />
      <div
        className={
          immersive
            ? "relative h-full w-full overflow-hidden bg-black"
            : "relative overflow-hidden rounded-[28px] border border-white/14 bg-[#111119] shadow-[0_28px_78px_rgba(0,0,0,.62),0_0_0_1px_rgba(255,255,255,.04)]"
        }
      >
        <div
          className={
            immersive
              ? "relative h-full w-full overflow-hidden bg-black"
              : "relative aspect-[9/16] h-[min(48svh,520px)] overflow-hidden bg-black"
          }
        >
          <video
            ref={videoRef}
            src={demoVideoUrl}
            className="h-full w-full object-cover"
            autoPlay
            muted={muted}
            playsInline
            preload="metadata"
            onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
            onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
            onEnded={() => {
              setImmersive(false);
              if (userStartedPlayback) onFinished();
            }}
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.18),transparent_30%,transparent_64%,rgba(0,0,0,.42))]" />
          <span className="absolute right-3 top-3 rounded-md bg-black/62 px-2.5 py-1.5 font-mono text-[12px] font-black text-white/86 backdrop-blur-md">
            {formatClock(duration > 0 ? Math.max(0, duration - currentTime) : currentTime)}
          </span>

          {muted ? (
            <button
              type="button"
              onClick={activateSound}
              className="absolute left-1/2 top-1/2 w-[76%] -translate-x-1/2 -translate-y-1/2 rounded-[9px] border border-white/72 bg-[#2515ad]/82 px-4 py-7 text-center text-white shadow-[0_22px_60px_rgba(38,22,173,.52),inset_0_1px_0_rgba(255,255,255,.24)] backdrop-blur-md"
            >
              <span className="block text-base font-medium">Pulse aqu&iacute;</span>
              <span className="mt-5 flex items-center justify-center gap-4">
                <Volume2 size={42} strokeWidth={2.6} fill="currentColor" />
                <X size={38} strokeWidth={4} />
              </span>
              <span className="mt-5 block text-base font-medium">para activar el sonido</span>
            </button>
          ) : null}

          <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10">
            <div className="h-full bg-[#2515ff]" style={{ width: `${progress}%` }} />
          </div>
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
  const threshold = 0.72;

  function getMaxTravel() {
    const trackWidth = trackRef.current?.getBoundingClientRect().width ?? 326;
    return Math.max(180, trackWidth - 112);
  }

  function commit(nextX: number) {
    const clamped = Math.max(0, Math.min(getMaxTravel(), nextX));
    setX(clamped);
  }

  function finish() {
    const max = getMaxTravel();
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
      className="relative mx-auto h-[64px] w-full max-w-full touch-none overflow-hidden rounded-full border border-white/20 bg-[linear-gradient(135deg,rgba(255,255,255,.34),rgba(255,255,255,.10)_42%,rgba(120,170,220,.18))] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,.38),inset_0_-18px_42px_rgba(0,0,0,.18),0_22px_54px_rgba(0,0,0,.42)] backdrop-blur-[26px] outline-none sm:max-w-[360px]"
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
        className="swipe-knob absolute left-1.5 top-1.5 grid size-[52px] place-items-center rounded-full bg-[linear-gradient(145deg,#ffffff,#dff1ff)] text-xl font-black text-black shadow-[inset_0_1px_0_rgba(255,255,255,.8),0_10px_30px_rgba(0,0,0,.35),0_0_0_1px_rgba(255,255,255,.35)]"
        style={{ transform: `translateX(${x}px)`, transition: dragging ? "none" : "transform 180ms ease" }}
      >
        ✓
      </div>
    </div>
  );
}

export default function Page() {
  const [index, setIndex] = useState(0);
  const [completedVideoIndex, setCompletedVideoIndex] = useState<number | null>(null);
  const slide = slides[index];
  const showSwipeControl =
    slide.visual !== "pricing" && (slide.visual !== "video" || completedVideoIndex === index);

  useEffect(() => {
    document.documentElement.classList.add("no-scroll-deck");
    document.body.classList.add("no-scroll-deck");
    return () => {
      document.documentElement.classList.remove("no-scroll-deck");
      document.body.classList.remove("no-scroll-deck");
    };
  }, []);

  return (
    <main className="h-[100svh] w-full overflow-hidden bg-[#050509] text-white md:h-dvh">
      <div className="relative mx-auto h-[100svh] w-full max-w-full overflow-hidden bg-[#050509] md:h-dvh md:max-w-[430px]">
        <div className="absolute left-[-120px] top-[-90px] size-72 rounded-full bg-[#ff2b2b]/26 blur-3xl" />
        <div className="absolute right-[-130px] top-36 size-80 rounded-full bg-orange-600/18 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,transparent,#050509_70%)]" />

        <section className="relative grid h-[100svh] min-w-0 grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden px-[clamp(16px,5vw,24px)] pb-[max(14px,env(safe-area-inset-bottom))] pt-[clamp(14px,2.4svh,22px)] md:h-dvh">
          <nav className="flex shrink-0 items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white/72">KreaStudio AI</span>
            {index === 0 ? (
              <HoverBorderGradient
                type="button"
                duration={1.15}
                containerClassName="shrink-0 border-[#3275F8]/80 shadow-[0_0_22px_rgba(50,117,248,.22)]"
                className="flex h-8 items-center gap-2 bg-[#07111f] px-3.5 py-0 text-[12px] font-semibold tracking-[0.08em] text-white/86"
              >
                <span>LOGIN</span>
                <svg aria-label="Google" viewBox="0 0 24 24" className="size-[15px]" role="img">
                  <path
                    fill="#4285F4"
                    d="M22.6 12.2c0-.8-.1-1.6-.2-2.3H12v4.4h5.9c-.3 1.4-1 2.5-2.1 3.2v2.7h3.4c2-1.8 3.4-4.5 3.4-8z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3 0 5.5-1 7.3-2.7l-3.4-2.7c-.9.6-2.2 1-3.9 1-3 0-5.6-2-6.5-4.8H2v2.8C3.8 20.4 7.6 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.5 13.8c-.2-.6-.4-1.2-.4-1.8s.1-1.2.4-1.8V7.4H2A10.9 10.9 0 0 0 1 12c0 1.6.4 3.2 1 4.6z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.4c1.6 0 3.1.6 4.3 1.7l3-3A10.2 10.2 0 0 0 12 1C7.6 1 3.8 3.6 2 7.4l3.5 2.8C6.4 7.4 9 5.4 12 5.4z"
                  />
                </svg>
              </HoverBorderGradient>
            ) : (
              <span className="h-8 w-[102px] shrink-0" aria-hidden="true" />
            )}
          </nav>

          <div
            className={`flex min-h-0 min-w-0 flex-col overflow-hidden pb-[clamp(10px,1.8svh,18px)] text-center ${
              slide.visual === "video"
                ? "justify-start pt-[clamp(28px,5svh,56px)]"
                : "justify-center pt-[clamp(12px,2.5svh,24px)]"
            }`}
          >
            <p className="mx-auto w-fit border border-[#ff2b2b]/35 bg-[#ff2b2b]/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-[#ff5a4f]">
              {slide.eyebrow}
            </p>
            <h1
              className={`mx-auto mt-[clamp(14px,2.4svh,22px)] w-full max-w-[min(92vw,640px)] text-balance font-black leading-[1.02] tracking-[-0.045em] ${slide.titleClass}`}
            >
              {slide.title}
            </h1>
            <p className="mx-auto mt-[clamp(12px,2svh,18px)] w-full max-w-[min(86vw,560px)] text-balance text-[clamp(12px,3.5vw,16px)] leading-[1.55] text-white/62">
              {slide.copy}
            </p>
            {slide.visual === "slider" ? <ImageAutoSlider /> : null}
            {slide.visual === "selector" ? <InteractiveSelector /> : null}
            {slide.visual === "video" ? <VideoReelsPlayer onFinished={() => setCompletedVideoIndex(index)} /> : null}
            {slide.visual === "pricing" ? <PricingPage /> : null}
            {slide.visual === "selector" ? <TypewriterTestimonial testimonials={testimonials} /> : null}
            {slide.visual === "slider" ? (
              <div className="mx-auto mt-[clamp(12px,2svh,18px)] flex w-full max-w-[360px] items-center justify-center gap-[clamp(10px,3.4vw,18px)] text-white/76">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[clamp(17px,4.8vw,22px)] font-black leading-none text-white">10x</span>
                  <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-white/42">rápido</span>
                </div>
                <span className="size-1 rounded-full bg-[#ff3b2f] shadow-[0_0_14px_rgba(255,59,47,.8)]" />
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[clamp(17px,4.8vw,22px)] font-black leading-none text-white">30</span>
                  <span className="max-w-[74px] text-left text-[8px] font-semibold uppercase leading-[1.1] tracking-[0.08em] text-white/42">
                    días de contenido
                  </span>
                </div>
                <span className="size-1 rounded-full bg-[#ff3b2f] shadow-[0_0_14px_rgba(255,59,47,.8)]" />
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[clamp(17px,4.8vw,22px)] font-black leading-none text-white">1</span>
                  <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-white/42">clic</span>
                </div>
              </div>
            ) : null}
          </div>

          {showSwipeControl ? (
            <div className="shrink-0">
              <SwipeControl
                label={swipeLabels[index] ?? "Desliza para avanzar"}
                onComplete={() => setIndex((current) => Math.min(current + 1, slides.length - 1))}
              />
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
