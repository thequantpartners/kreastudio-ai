import { generateText, Output } from "ai";
import { openai } from "@ai-sdk/openai";
import { campaignSchema, type BrandBriefInput } from "./schema";
import { buildCampaignPrompt } from "./prompt";

export async function generateContentCampaign(brief: BrandBriefInput) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Falta configurar OPENAI_API_KEY en el servidor.");
  }

  const { output } = await generateText({
    model: openai("gpt-5-mini"),
    output: Output.object({
      schema: campaignSchema,
    }),
    system:
      "Eres un estratega senior de contenido y performance marketing para pequenos negocios. Devuelves calendarios utiles, especificos y listos para publicar.",
    prompt: buildCampaignPrompt(brief),
  });

  return output.posts;
}
