import { NextResponse } from "next/server";
import { getCreditPack, getMercadoPagoPayment } from "@/server/payments/mercado-pago";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const paymentId = body?.data?.id ?? body?.id;

  if (!paymentId) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const payment = await getMercadoPagoPayment(String(paymentId));
  const packId = String(payment.metadata?.pack_id ?? "");
  const pack = getCreditPack(packId);

  if (payment.status !== "approved" || !pack) {
    return NextResponse.json({
      ok: true,
      paymentStatus: payment.status,
      credited: false,
    });
  }

  // TODO: Persist this in a database ledger before enabling real user balances.
  return NextResponse.json({
    ok: true,
    credited: true,
    credits: pack.credits,
    externalReference: payment.external_reference,
  });
}
