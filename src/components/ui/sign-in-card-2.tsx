"use client";

import React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowLeft } from "lucide-react";

type SignInCardProps = {
  onBack?: () => void;
  onContinue?: () => void;
};

export function Component({ onBack, onContinue }: Readonly<SignInCardProps>) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left - rect.width / 2);
    mouseY.set(event.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="relative flex h-[100svh] w-full items-center justify-center overflow-hidden bg-[#050509] px-5 py-6 text-white md:h-dvh">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,transparent,#050509_72%)]" />
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />
      <div className="absolute left-[-120px] top-[-90px] size-72 rounded-full bg-[#ff2b2b]/26 blur-3xl" />
      <div className="absolute right-[-130px] top-36 size-80 rounded-full bg-orange-600/18 blur-3xl" />
      <div className="absolute left-1/2 top-0 h-[60vh] w-[120vh] -translate-x-1/2 rounded-b-[50%] bg-[#3275F8]/14 blur-[80px]" />
      <motion.div
        className="absolute left-1/2 top-0 h-[60vh] w-[100vh] -translate-x-1/2 rounded-b-full bg-[#ff2b2b]/16 blur-[60px]"
        animate={{
          opacity: [0.15, 0.3, 0.15],
          scale: [0.98, 1.02, 0.98],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "mirror",
        }}
      />
      <motion.div
        className="absolute bottom-0 left-1/2 h-[90vh] w-[90vh] -translate-x-1/2 rounded-t-full bg-orange-600/14 blur-[60px]"
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "mirror",
          delay: 1,
        }}
      />
      <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-[#3275F8]/10 opacity-40 blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-[#ff2b2b]/10 opacity-40 blur-[100px] delay-1000" />

      <button
        type="button"
        onClick={onBack}
        className="absolute left-4 top-4 z-20 inline-flex size-10 items-center justify-center rounded-full border border-white/12 bg-black/35 text-white/80 shadow-[0_14px_34px_rgba(0,0,0,.28)] backdrop-blur-xl transition hover:bg-white/10 hover:text-white"
        aria-label="Volver a la primera seccion"
      >
        <ArrowLeft className="size-4" />
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-sm"
        style={{ perspective: 1500 }}
      >
        <motion.div
          className="relative"
          style={{ rotateX, rotateY }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileHover={{ z: 10 }}
        >
          <div className="group relative">
            <motion.div
              className="absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-700 group-hover:opacity-70"
              animate={{
                boxShadow: [
                  "0 0 10px 2px rgba(255,255,255,0.03)",
                  "0 0 15px 5px rgba(255,255,255,0.05)",
                  "0 0 10px 2px rgba(255,255,255,0.03)",
                ],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "mirror",
              }}
            />

            <div className="absolute -inset-px overflow-hidden rounded-2xl">
              <motion.div
                className="absolute left-0 top-0 h-[3px] w-1/2 bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
                initial={{ filter: "blur(2px)" }}
                animate={{
                  left: ["-50%", "100%"],
                  opacity: [0.3, 0.7, 0.3],
                  filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"],
                }}
                transition={{
                  left: { duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 },
                  opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror" },
                  filter: { duration: 1.5, repeat: Infinity, repeatType: "mirror" },
                }}
              />
              <motion.div
                className="absolute right-0 top-0 h-1/2 w-[3px] bg-gradient-to-b from-transparent via-white to-transparent opacity-70"
                initial={{ filter: "blur(2px)" }}
                animate={{
                  top: ["-50%", "100%"],
                  opacity: [0.3, 0.7, 0.3],
                  filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"],
                }}
                transition={{
                  top: { duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1, delay: 0.6 },
                  opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror", delay: 0.6 },
                  filter: { duration: 1.5, repeat: Infinity, repeatType: "mirror", delay: 0.6 },
                }}
              />
              <motion.div
                className="absolute bottom-0 right-0 h-[3px] w-1/2 bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
                initial={{ filter: "blur(2px)" }}
                animate={{
                  right: ["-50%", "100%"],
                  opacity: [0.3, 0.7, 0.3],
                  filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"],
                }}
                transition={{
                  right: { duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1, delay: 1.2 },
                  opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror", delay: 1.2 },
                  filter: { duration: 1.5, repeat: Infinity, repeatType: "mirror", delay: 1.2 },
                }}
              />
              <motion.div
                className="absolute bottom-0 left-0 h-1/2 w-[3px] bg-gradient-to-b from-transparent via-white to-transparent opacity-70"
                initial={{ filter: "blur(2px)" }}
                animate={{
                  bottom: ["-50%", "100%"],
                  opacity: [0.3, 0.7, 0.3],
                  filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"],
                }}
                transition={{
                  bottom: { duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1, delay: 1.8 },
                  opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror", delay: 1.8 },
                  filter: { duration: 1.5, repeat: Infinity, repeatType: "mirror", delay: 1.8 },
                }}
              />
            </div>

            <div className="absolute -inset-[0.5px] rounded-2xl bg-gradient-to-r from-white/[0.03] via-white/[0.07] to-white/[0.03] opacity-0 transition-opacity duration-500 group-hover:opacity-70" />

            <div className="relative overflow-hidden rounded-2xl border border-white/[0.05] bg-black/40 p-6 shadow-2xl backdrop-blur-xl">
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, white 0.5px, transparent 0.5px), linear-gradient(45deg, white 0.5px, transparent 0.5px)",
                  backgroundSize: "30px 30px",
                }}
              />

              <div className="mb-6 space-y-2 text-center">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className="relative mx-auto flex size-12 items-center justify-center overflow-hidden rounded-full border border-white/10"
                >
                  <span className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-xl font-bold text-transparent">
                    S
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-b from-white to-white/80 bg-clip-text text-2xl font-bold text-transparent"
                >
                  Inicia sesion
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mx-auto max-w-[260px] text-sm leading-5 text-white/60"
                >
                  Continua con Google para crear contenido en minutos
                </motion.p>
              </div>

              <div className="space-y-4">
                <div id="clerk-captcha" data-cl-theme="dark" data-cl-size="flexible" data-cl-language="es-es" />

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onContinue}
                  className="group/google relative w-full"
                >
                  <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 blur-xl transition-opacity duration-300 group-hover/google:opacity-80" />
                  <div className="relative flex h-12 items-center justify-center gap-3 overflow-hidden rounded-xl border border-white/15 bg-white text-sm font-semibold text-black shadow-[0_18px_44px_rgba(0,0,0,.24),inset_0_1px_0_rgba(255,255,255,.8)] transition-all duration-300 hover:border-white/40">
                    <div className="flex size-5 items-center justify-center rounded-full bg-black text-xs font-black text-white transition-transform duration-300 group-hover/google:scale-110">
                      G
                    </div>
                    <span>
                      Continue with Google
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/35 to-white/0"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{
                        duration: 1,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                </motion.button>

                <motion.p
                  className="mx-auto max-w-[250px] text-center text-[11px] leading-4 text-white/38"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Acceso rapido para empezar sin formularios ni contrasenas.
                </motion.p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
