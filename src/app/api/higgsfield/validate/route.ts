import { NextResponse } from "next/server";
import { validateHiggsfieldConfiguration } from "@/server/higgsfield/status";

export const runtime = "nodejs";

export async function POST() {
  const validation = validateHiggsfieldConfiguration();

  return NextResponse.json(validation, {
    status: validation.ok ? 200 : 500,
  });
}
