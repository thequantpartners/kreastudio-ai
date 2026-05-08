import { NextResponse } from "next/server";
import { generateContentCampaign } from "@/server/content/generate";
import { briefSchema } from "@/server/content/schema";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const brief = briefSchema.parse(body?.brief);
    const posts = await generateContentCampaign(brief);

    return NextResponse.json({
      ok: true,
      message: "Contenido de 30 dias generado correctamente.",
      posts,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "No se pudo generar el contenido.",
      },
      { status: 500 }
    );
  }
}
