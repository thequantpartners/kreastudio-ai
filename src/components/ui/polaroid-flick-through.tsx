"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { RefreshCw } from "lucide-react";

type CardData = {
  id: string;
  label: string;
  caption: string;
  gradient: string;
};

type ScatterPosition = {
  x: number;
  y: number;
  rotation: number;
  scale: number;
};

type ImageStackRef = {
  reshuffle: () => void;
};

class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next() {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  range(min: number, max: number) {
    return min + this.next() * (max - min);
  }
}

const cards: CardData[] = [
  {
    id: "ecom",
    label: "Product launch",
    caption: "Oferta lista para Ads",
    gradient:
      "radial-gradient(circle at 28% 18%,#fff7,transparent 15%),linear-gradient(135deg,#2b0909,#ff2b2b 46%,#f97316)",
  },
  {
    id: "food",
    label: "Menu promo",
    caption: "Post semanal",
    gradient:
      "radial-gradient(circle at 70% 18%,#fff,transparent 13%),linear-gradient(135deg,#0b1022,#2563eb 42%,#ff2b2b)",
  },
  {
    id: "real",
    label: "Real estate",
    caption: "Creative para leads",
    gradient:
      "radial-gradient(circle at 34% 24%,#fb7185,transparent 17%),linear-gradient(135deg,#09090b,#7f1d1d 50%,#facc15)",
  },
  {
    id: "coach",
    label: "Coach offer",
    caption: "Hook + CTA",
    gradient:
      "radial-gradient(circle at 60% 20%,#fff5,transparent 16%),linear-gradient(135deg,#101010,#ff2b2b 45%,#111827)",
  },
  {
    id: "agency",
    label: "Agency pack",
    caption: "Campaña mensual",
    gradient:
      "radial-gradient(circle at 36% 18%,#fecaca,transparent 16%),linear-gradient(135deg,#1f0a0a,#f43f5e 46%,#7c2d12)",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.05,
      staggerChildren: 0.18,
    },
  },
};

const cardVariants = {
  hidden: (custom: { zIndex: number }) => ({
    x: 0,
    y: 0,
    rotate: 0,
    scale: 0.96,
    opacity: 0,
    zIndex: custom.zIndex,
  }),
  visible: (custom: {
    position: ScatterPosition;
    zIndex: number;
    springConfig:
      | { type: "tween"; duration: number }
      | { type: "spring"; stiffness: number; damping: number };
  }) => ({
    x: custom.position.x,
    y: custom.position.y,
    rotate: custom.position.rotation,
    scale: custom.position.scale,
    opacity: 1,
    zIndex: custom.zIndex,
    transition: custom.springConfig,
  }),
};

export const PolaroidFlickThrough = React.forwardRef<ImageStackRef>(function PolaroidFlickThrough(_, ref) {
  const [visible, setVisible] = React.useState(false);
  const [seed, setSeed] = React.useState(12345);
  const prefersReducedMotion = useReducedMotion();

  React.useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 180);
    return () => window.clearTimeout(timer);
  }, []);

  const positions = React.useMemo(() => {
    const rng = new SeededRandom(seed);
    return cards.map(() => ({
      x: rng.range(-76, 76),
      y: rng.range(-18, 26),
      rotation: rng.range(-11, 11),
      scale: rng.range(0.94, 1.04),
    }));
  }, [seed]);

  const reshuffle = React.useCallback(() => {
    setVisible(false);
    window.setTimeout(() => {
      setSeed(Math.floor(Math.random() * 1000000));
      setVisible(true);
    }, 110);
  }, []);

  React.useImperativeHandle(ref, () => ({ reshuffle }), [reshuffle]);

  const springConfig = prefersReducedMotion
    ? { type: "tween", duration: 0.25 }
    : { type: "spring", stiffness: 96, damping: 16 };

  return (
    <div className="relative h-[42dvh] min-h-[300px] w-full overflow-hidden">
      <div className="absolute inset-x-10 top-20 h-48 rounded-full bg-[#ff2b2b]/20 blur-3xl" />
      <motion.div
        className="relative h-full w-full"
        variants={containerVariants}
        initial="hidden"
        animate={visible ? "visible" : "hidden"}
      >
        {cards.map((card, index) => {
          const position = positions[index];
          return (
            <motion.div
              key={`${card.id}-${seed}`}
              className="absolute left-1/2 top-1/2"
              variants={cardVariants}
              custom={{
                position,
                zIndex: cards.length - index,
                springConfig,
              }}
              style={{
                marginLeft: "-86px",
                marginTop: "-128px",
              }}
              whileTap={{ scale: 1.08, zIndex: 50 }}
              whileHover={{ scale: 1.06, zIndex: 50 }}
              drag
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            >
              <div className="w-[172px] rounded-[18px] border border-white/10 bg-[#f4eee8] p-2.5 shadow-[0_24px_60px_rgba(0,0,0,.45)]">
                <div className="relative h-[210px] overflow-hidden rounded-[12px]" style={{ background: card.gradient }}>
                  <span className="absolute left-3 top-3 rounded-full bg-black/65 px-2 py-1 text-[9px] font-black uppercase tracking-[0.08em] text-white">
                    {card.label}
                  </span>
                  <div className="absolute bottom-3 left-3 right-3 bg-black/42 p-2 backdrop-blur">
                    <div className="h-1.5 rounded-full bg-white/58" />
                    <div className="mt-1.5 h-1.5 w-2/3 rounded-full bg-white/28" />
                  </div>
                </div>
                <p className="mt-2 text-center text-[11px] font-black uppercase tracking-[0.08em] text-[#1a1515]">
                  {card.caption}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      <button
        type="button"
        onClick={reshuffle}
        className="absolute bottom-2 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-bold text-white/78 backdrop-blur-xl"
      >
        <RefreshCw size={13} />
        Mezclar resultados
      </button>
    </div>
  );
});
