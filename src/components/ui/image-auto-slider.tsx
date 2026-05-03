"use client";

import React from "react";

const images = [
  "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=2152&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=2126&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1673264933212-d78737f38e48?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1711434824963-ca894373272e?q=80&w=2030&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1675705721263-0bbeec261c49?q=80&w=1940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1524799526615-766a9833dec0?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

export const Component = () => {
  const duplicatedImages = [...images, ...images];

  return (
    <div className="relative mx-auto mt-[clamp(12px,2svh,20px)] h-[min(34svh,320px)] min-h-[236px] w-full max-w-full overflow-hidden">
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
            black 10%,
            black 90%,
            transparent 100%
          );
          -webkit-mask: linear-gradient(
            90deg,
            transparent 0%,
            black 10%,
            black 90%,
            transparent 100%
          );
        }
      `}</style>

      <div className="absolute inset-x-8 top-[20%] h-[58%] rounded-full bg-[#ff2b2b]/18 blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(5,5,9,.28)_72%,rgba(5,5,9,.78))]" />

      <div className="image-auto-slider-mask absolute inset-0 z-10 flex min-w-0 items-center overflow-hidden">
        <div className="image-auto-slider-track flex w-max max-w-none gap-4 pr-4">
          {duplicatedImages.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="shrink-0 overflow-hidden rounded-[20px] border border-white/10 bg-[#111119] shadow-[0_24px_60px_rgba(0,0,0,.45)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt={`Gallery image ${(index % images.length) + 1}`}
                className="h-[min(28svh,250px)] min-h-[188px] w-[min(46vw,210px)] min-w-[150px] object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
