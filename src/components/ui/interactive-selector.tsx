"use client";

import React, { useEffect, useState } from "react";
import { Bath, Droplets, Flame, Mountain, TentTree } from "lucide-react";

const options = [
  {
    title: "Luxury Tent",
    description: "Cozy glamping under the stars",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    icon: TentTree,
  },
  {
    title: "Campfire Feast",
    description: "Gourmet stories and offers",
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
    icon: Flame,
  },
  {
    title: "Lakeside Retreat",
    description: "Fresh angles for stories",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    icon: Droplets,
  },
  {
    title: "Mountain Spa",
    description: "Premium campaign mood",
    image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80",
    icon: Bath,
  },
  {
    title: "Guided Adventure",
    description: "Ready-to-publish ideas",
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80",
    icon: Mountain,
  },
];

export default function InteractiveSelector() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animatedOptions, setAnimatedOptions] = useState<number[]>([]);

  useEffect(() => {
    const timers = options.map((_, index) =>
      window.setTimeout(() => {
        setAnimatedOptions((current) => (current.includes(index) ? current : [...current, index]));
      }, 140 * index),
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  function getPanelStyle(index: number) {
    const isFirst = activeIndex === 0;
    const isLast = activeIndex === options.length - 1;

    if (index === activeIndex) {
      if (isFirst) return { left: "0%", width: "90%" };
      if (isLast) return { left: "10%", width: "90%" };
      return { left: "10%", width: "80%" };
    }

    if (index === activeIndex - 1) return { left: "0%", width: "10%" };
    if (index === activeIndex + 1) return { left: "90%", width: "10%" };

    return index < activeIndex ? { left: "-12%", width: "10%" } : { left: "102%", width: "10%" };
  }

  return (
    <div className="relative mx-auto mt-[clamp(12px,2svh,20px)] h-[min(34svh,320px)] min-h-[236px] w-full max-w-full overflow-hidden">
      <div className="absolute inset-x-8 top-[18%] h-[64%] rounded-full bg-[#ff2b2b]/16 blur-3xl" />
      <div className="relative z-10 h-full w-full min-w-0 overflow-hidden rounded-[24px] border border-white/10 bg-[#111119] shadow-[0_24px_70px_rgba(0,0,0,.5)]">
          {options.map((option, index) => {
            const Icon = option.icon;
            const active = activeIndex === index;
            const visible = animatedOptions.includes(index);
            const panel = getPanelStyle(index);
            const isPreview = Math.abs(index - activeIndex) === 1;

            return (
              <button
                type="button"
                key={option.title}
                aria-label={option.title}
                onClick={() => setActiveIndex(index)}
                className="absolute top-0 h-full overflow-hidden bg-[#18181b] text-left transition-[left,width,opacity,transform,box-shadow] duration-700 ease-in-out"
                style={{
                  left: panel.left,
                  width: panel.width,
                  backgroundImage: `url('${option.image}')`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  border: active ? "2px solid rgba(255,255,255,.82)" : "1px solid rgba(255,255,255,.14)",
                  borderRadius: 22,
                  boxShadow: active ? "0 20px 60px rgba(0,0,0,0.50)" : "0 10px 30px rgba(0,0,0,0.30)",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateX(0)" : "translateX(-44px)",
                  zIndex: active ? 10 : isPreview ? 5 : 1,
                }}
              >
                <div
                  className="absolute inset-x-0 bottom-0 h-32 transition-opacity duration-700"
                  style={{
                    boxShadow: "inset 0 -120px 120px -74px #000, inset 0 -120px 120px -92px #000",
                  }}
                />

                <div className="absolute bottom-4 left-0 right-0 flex h-12 items-center gap-3 px-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full border border-white/15 bg-black/62 text-white shadow-[0_1px_8px_rgba(0,0,0,.28)] backdrop-blur-md">
                    <Icon size={20} />
                  </span>
                  <span
                    className="min-w-0 text-white transition-opacity duration-300"
                    style={{ opacity: active ? 1 : 0 }}
                  >
                    <span className="block truncate text-[15px] font-black">{option.title}</span>
                    <span className="block truncate text-[12px] font-medium text-white/70">{option.description}</span>
                  </span>
                </div>
              </button>
            );
          })}
      </div>
    </div>
  );
}
