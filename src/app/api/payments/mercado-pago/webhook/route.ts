import { NextResponse } from "next/server";
import { getMercadoPagoPayment, persistMercadoPagoPaymentResult } from "@/server/payments/mercado-pago";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const paymentId = body?.data?.id ?? body?.id;

  if (!paymentId) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const payment = await getMercadoPagoPayment(String(paymentId));
  const externalReference = String(payment.external_reference ?? "");
  const raw = JSON.parse(JSON.stringify(payment)) as Record<string, unknown>;

  if (!externalReference) {
    return NextResponse.json({
      ok: true,
      paymentStatus: payment.status,
      ignored: true,
      reason: "missing_external_reference",
    });
  }

  const result = await persistMercadoPagoPaymentResult(
    externalReference,
    String(payment.id ?? paymentId),
    String(payment.status ?? "unknown"),
    raw
  );

  if (payment.status !== "approved") {
    return NextResponse.json({
      ok: true,
      paymentStatus: payment.status,
      credited: false,
      result,
    });
  }

  return NextResponse.json({
    ok: true,
    paymentStatus: payment.status,
    result,
  });
}
