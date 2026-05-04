"use client";

import React from "react";

const outputs = [
  {
    image:
      "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    format: "Story",
    title: "Oferta express",
    tone: "Neon retail",
  },
  {
    image:
      "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=2126&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    format: "Ad",
    title: "Lanzamiento",
    tone: "High contrast",
  },
  {
    image:
      "https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    format: "Post",
    title: "Menu promo",
    tone: "Warm editorial",
  },
  {
    image:
      "https://plus.unsplash.com/premium_photo-1673264933212-d78737f38e48?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    format: "Reel",
    title: "Producto hero",
    tone: "Premium depth",
  },
  {
    image:
      "https://images.unsplash.com/photo-1524799526615-766a9833dec0?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    format: "Copy",
    title: "CTA listo",
    tone: "Sales angle",
  },
];

export const Component = () => {
  const duplicatedOutputs = [...outputs, ...outputs];

  return (
    <div className="relative mx-auto mt-[clamp(14px,2.2svh,22px)] h-[min(34svh,314px)] min-h-[226px] w-full max-w-full overflow-hidden">
      <style>{`
        @keyframes image-auto-slider-scroll-right {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .image-auto-slider-track {
          animation: image-auto-slider-scroll-right 22s linear infinite;
        }

        .image-auto-slider-mask {
          mask: linear-gradient(
            90deg,
            transparent 0%,
            black 5%,
            black 95%,
            transparent 100%
          );
          -webkit-mask: linear-gradient(
            90deg,
            transparent 0%,
            black 5%,
            black 95%,
            transparent 100%
          );
        }
      `}</style>

      <div className="absolute inset-x-[-10%] top-[18%] h-[64%] rounded-full bg-[#ff3b2f]/24 blur-3xl" />
      <div className="absolute bottom-[4%] left-[10%] h-[44%] w-[80%] rounded-full bg-orange-500/16 blur-2xl" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(5,5,9,.18)_58%,rgba(5,5,9,.82))]" />
      <div className="absolute left-1/2 top-[10%] z-20 -translate-x-1/2 rounded-full border border-white/10 bg-black/38 px-3 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-white/62 backdrop-blur-md">
        Output preview
      </div>

      <div className="image-auto-slider-mask absolute inset-0 z-10 flex min-w-0 items-center overflow-hidden">
        <div className="image-auto-slider-track flex w-max max-w-none gap-3 pr-3">
          {duplicatedOutputs.map((output, index) => (
            <div
              key={`${output.image}-${index}`}
              className="group relative shrink-0 overflow-hidden rounded-[22px] border border-white/12 bg-[#111119] shadow-[0_26px_66px_rgba(0,0,0,.52)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={output.image}
                alt={`${output.format} creative preview`}
                className="h-[min(28.5svh,252px)] min-h-[188px] w-[min(58vw,246px)] min-w-[196px] object-cover saturate-[1.08]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.12),transparent_34%,rgba(0,0,0,.76))]" />
              <div className="absolute left-3 top-3 rounded-full border border-white/14 bg-black/46 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-white backdrop-blur-md">
                {output.format}
              </div>
              <div className="absolute right-3 top-3 rounded-full bg-[#ff3b2f] px-2 py-1 text-[9px] font-black uppercase tracking-[0.1em] text-white shadow-[0_8px_24px_rgba(255,59,47,.34)]">
                Ready
              </div>
              <div className="absolute inset-x-3 bottom-3 text-left">
                <p className="text-[15px] font-black leading-none text-white">{output.title}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="h-px w-8 bg-[#ff5a4f]" />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white/58">{output.tone}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
