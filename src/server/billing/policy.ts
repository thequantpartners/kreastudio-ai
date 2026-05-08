export type BillableAction = "content_campaign_30_days" | "higgsfield_image";

export type CreditQuote = {
  action: BillableAction;
  quantity: number;
  unitCredits: number;
  totalCredits: number;
  description: string;
};

export const creditPacks = [
  {
    id: "starter",
    name: "Starter",
    priceCents: 900,
    currency: "usd",
    credits: 10,
  },
  {
    id: "pro",
    name: "Pro",
    priceCents: 2900,
    currency: "usd",
    credits: 40,
  },
  {
    id: "agency",
    name: "Agency",
    priceCents: 5000,
    currency: "usd",
    credits: 80,
  },
] as const;

export const creditCosts: Record<BillableAction, Omit<CreditQuote, "action" | "quantity" | "totalCredits">> = {
  content_campaign_30_days: {
    unitCredits: 1,
    description: "Calendario, estrategia, copys y prompts visuales para 30 dias.",
  },
  higgsfield_image: {
    unitCredits: 4,
    description: "Una imagen generada con Higgsfield para una pieza de contenido.",
  },
};

export function quoteCredits(action: BillableAction, quantity = 1): CreditQuote {
  const normalizedQuantity = Math.max(1, Math.floor(quantity));
  const cost = creditCosts[action];

  return {
    action,
    quantity: normalizedQuantity,
    unitCredits: cost.unitCredits,
    totalCredits: cost.unitCredits * normalizedQuantity,
    description: cost.description,
  };
}

export function quoteCampaignWithImages(imageCount: number) {
  const content = quoteCredits("content_campaign_30_days");
  const images = quoteCredits("higgsfield_image", imageCount);

  return {
    content,
    images,
    totalCredits: content.totalCredits + images.totalCredits,
  };
}
