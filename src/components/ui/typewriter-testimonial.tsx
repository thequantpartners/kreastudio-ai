"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Testimonial = {
  image: string;
  audio?: string;
  text: string;
  name: string;
  jobtitle: string;
};

type ComponentProps = {
  testimonials: Testimonial[];
};

export const Component: React.FC<ComponentProps> = ({ testimonials }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasBeenActive, setHasBeenActive] = useState<boolean[]>(() =>
    testimonials.map((_, index) => index === 0),
  );
  const [typedText, setTypedText] = useState(() => testimonials[0]?.text ?? "");
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const typewriterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopAudio = useCallback(() => {
    if (!audioPlayerRef.current) return;
    audioPlayerRef.current.pause();
    audioPlayerRef.current.currentTime = 0;
    audioPlayerRef.current.src = "";
    audioPlayerRef.current.load();
    audioPlayerRef.current = null;
  }, []);

  const stopTypewriter = useCallback(() => {
    if (typewriterTimeoutRef.current) {
      clearTimeout(typewriterTimeoutRef.current);
      typewriterTimeoutRef.current = null;
    }
    setTypedText("");
  }, []);

  const startTypewriter = useCallback(
    (text: string) => {
      stopTypewriter();

      let index = 0;
      const type = () => {
        setTypedText(text.slice(0, index));
        index += 1;

        if (index <= text.length) {
          typewriterTimeoutRef.current = setTimeout(type, 24);
        }
      };

      type();
    },
    [stopTypewriter],
  );

  const activate = useCallback(
    (index: number) => {
      const testimonial = testimonials[index];
      if (!testimonial) return;

      stopAudio();
      setActiveIndex(index);
      setHasBeenActive((current) => {
        const updated = [...current];
        updated[index] = true;
        return updated;
      });
      startTypewriter(testimonial.text);

      if (testimonial.audio) {
        const audio = new Audio(`/audio/${testimonial.audio}`);
        audioPlayerRef.current = audio;
        audio.play().catch(() => undefined);
      }
    },
    [startTypewriter, stopAudio, testimonials],
  );

  useEffect(() => {
    return () => {
      stopAudio();
      stopTypewriter();
    };
  }, [activate, stopAudio, stopTypewriter]);

  const active = testimonials[activeIndex];

  if (!active) return null;

  return (
    <div className="relative mx-auto mt-[clamp(12px,2svh,18px)] w-full max-w-[360px]">
      <div className="absolute inset-x-10 top-4 h-14 rounded-full bg-[#ff3b2f]/16 blur-2xl" />
      <div className="pointer-events-none absolute -inset-3 rounded-[28px] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,.12),transparent_52%),radial-gradient(circle_at_82%_80%,rgba(255,59,47,.18),transparent_46%)] blur-xl" />
      <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,.075),rgba(255,255,255,.03)_52%,rgba(255,59,47,.07))] px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,.12),0_18px_46px_rgba(0,0,0,.32)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,.08),transparent_48%),linear-gradient(90deg,rgba(5,5,9,.38),transparent_16%,transparent_84%,rgba(5,5,9,.38))]" />
        <div className="flex items-center justify-center gap-2">
          {testimonials.map((testimonial, index) => {
            const isActive = activeIndex === index;
            return (
              <motion.button
                key={testimonial.image}
                type="button"
                aria-label={`Ver testimonio de ${testimonial.name}`}
                onClick={() => activate(index)}
                onMouseEnter={() => activate(index)}
                whileTap={{ scale: 0.94 }}
                className="relative shrink-0 rounded-full outline-none"
              >
                <motion.img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="size-[clamp(34px,9vw,42px)] rounded-full border-2 object-cover shadow-[0_10px_24px_rgba(0,0,0,.35)]"
                  animate={{
                    borderColor: isActive || hasBeenActive[index] ? "#ff5a4f" : "rgba(255,255,255,.24)",
                    opacity: isActive ? 1 : 0.58,
                    scale: isActive ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.25 }}
                />
                {isActive ? (
                  <motion.span
                    layoutId="testimonial-active-dot"
                    className="absolute -bottom-1 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-[#ff3b2f] shadow-[0_0_14px_rgba(255,59,47,.9)]"
                  />
                ) : null}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
            className="relative mt-3 text-left"
          >
            <div className="min-h-[44px] text-[12px] leading-[1.45] text-white/72">
              &ldquo;{typedText}
              <span className="text-[#ff5a4f]">|</span>&rdquo;
            </div>
            <div className="mt-2 flex items-center justify-between gap-3 border-t border-white/8 pt-2">
              <div>
                <p className="text-[12px] font-black leading-none text-white">{active.name}</p>
                <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/40">
                  {active.jobtitle}
                </p>
              </div>
              <span className="rounded-full border border-[#ff3b2f]/30 bg-[#ff3b2f]/10 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.1em] text-[#ff6b61]">
                Cliente verificado
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
