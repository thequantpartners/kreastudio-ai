import { z } from "zod";

export const briefSchema = z.object({
  brandName: z.string().trim().min(1),
  description: z.string().trim().min(1),
  palette: z.array(z.string().trim().min(1)).min(1),
  offer: z.string().trim().min(1),
  audience: z.string().trim().min(1),
  goal: z.string().trim().min(1),
});

export const campaignPostSchema = z.object({
  day: z.number().int().min(1).max(30),
  title: z.string().trim().min(1),
  format: z.enum(["Post cuadrado", "Story", "Reel cover", "Carrusel"]),
  pillar: z.enum(["Oferta", "Educativo", "Prueba social", "Objecion", "Beneficio"]),
  goal: z.string().trim().min(1),
  cta: z.string().trim().min(1),
  color: z.string().trim().min(1),
  copy: z.string().trim().min(1),
  imagePrompt: z.string().trim().min(1),
  variants: z
    .array(
      z.object({
        tone: z.enum(["Directo", "Emocional", "Oferta", "Educativo", "Urgencia"]),
        copy: z.string().trim().min(1),
      })
    )
    .length(5),
});

export const campaignSchema = z.object({
  posts: z.array(campaignPostSchema).length(30),
});

export type BrandBriefInput = z.infer<typeof briefSchema>;
export type GeneratedCampaignPost = z.infer<typeof campaignPostSchema>;
