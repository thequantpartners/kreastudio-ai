import { NextResponse } from "next/server";
import { createCreditCheckout } from "@/server/payments/mercado-pago";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const packId = String(body?.packId ?? "");
    const customerEmail = typeof body?.customerEmail === "string" ? body.customerEmail : undefined;
    const checkout = await createCreditCheckout(packId, customerEmail);

    return NextResponse.json({
      ok: true,
      checkout,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "No se pudo crear el checkout.",
      },
      { status: 500 }
    );
  }
}
