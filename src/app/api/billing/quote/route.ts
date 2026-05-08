import { NextResponse } from "next/server";
import { quoteCampaignWithImages } from "@/server/billing/policy";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const imageCount = Number(body?.imageCount ?? 0);

  return NextResponse.json({
    ok: true,
    quote: quoteCampaignWithImages(imageCount),
  });
}
