import { NextResponse } from "next/server";
import { getAuthenticatedAppUser } from "@/server/auth/app-user";
import { createCreditCheckout } from "@/server/payments/mercado-pago";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const packId = String(body?.packId ?? "");
    const appUser = await getAuthenticatedAppUser();
    const checkout = await createCreditCheckout(packId, appUser);

    return NextResponse.json({
      ok: true,
      checkout,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo crear el checkout.";

    return NextResponse.json(
      {
        ok: false,
        message,
      },
      { status: message === "Unauthorized" ? 401 : 500 }
    );
  }
}
