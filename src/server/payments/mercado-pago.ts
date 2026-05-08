import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import { creditPacks } from "@/server/billing/policy";

export type CreditPackId = (typeof creditPacks)[number]["id"];

function getAccessToken() {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN?.trim();

  if (!accessToken) {
    throw new Error("Falta configurar MERCADO_PAGO_ACCESS_TOKEN en el servidor.");
  }

  return accessToken;
}

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://127.0.0.1:3000";
}

export function getCreditPack(packId: string) {
  return creditPacks.find((pack) => pack.id === packId);
}

export function createMercadoPagoClient() {
  return new MercadoPagoConfig({
    accessToken: getAccessToken(),
    options: { timeout: 10000 },
  });
}

export async function createCreditCheckout(packId: string, customerEmail?: string) {
  const pack = getCreditPack(packId);

  if (!pack) {
    throw new Error("Paquete de creditos no valido.");
  }

  const appUrl = getAppUrl();
  const client = createMercadoPagoClient();
  const preference = new Preference(client);
  const externalReference = `credits:${pack.id}:${Date.now()}`;

  const result = await preference.create({
    body: {
      external_reference: externalReference,
      notification_url: `${appUrl}/api/payments/mercado-pago/webhook`,
      back_urls: {
        success: `${appUrl}/?payment=success`,
        pending: `${appUrl}/?payment=pending`,
        failure: `${appUrl}/?payment=failure`,
      },
      auto_return: "approved",
      payer: customerEmail ? { email: customerEmail } : undefined,
      metadata: {
        pack_id: pack.id,
        credits: pack.credits,
      },
      items: [
        {
          id: pack.id,
          title: `${pack.name} - ${pack.credits} creditos KreaStudio`,
          description: "Saldo prepago para generar contenido e imagenes dentro de KreaStudio.",
          quantity: 1,
          currency_id: pack.currency.toUpperCase(),
          unit_price: pack.priceCents / 100,
        },
      ],
    },
  });

  return {
    pack,
    externalReference,
    checkoutUrl: result.init_point || result.sandbox_init_point,
    preferenceId: result.id,
  };
}

export async function getMercadoPagoPayment(paymentId: string) {
  const client = createMercadoPagoClient();
  const payment = new Payment(client);

  return payment.get({ id: paymentId });
}
