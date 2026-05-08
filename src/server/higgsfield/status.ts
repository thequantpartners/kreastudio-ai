import { createHiggsfieldClient } from "@higgsfield/client/v2";

type HiggsfieldValidation =
  | {
      ok: true;
      message: string;
    }
  | {
      ok: false;
      message: string;
      reason: "missing_credentials" | "invalid_credentials_format" | "sdk_error";
    };

function getCredentials() {
  const credentials = process.env.HF_CREDENTIALS?.trim();

  if (!credentials) {
    return null;
  }

  return credentials;
}

function hasValidCredentialsShape(credentials: string) {
  const [keyId, keySecret, ...rest] = credentials.split(":");

  return Boolean(keyId?.trim() && keySecret?.trim() && rest.length === 0);
}

export function validateHiggsfieldConfiguration(): HiggsfieldValidation {
  const credentials = getCredentials();

  if (!credentials) {
    return {
      ok: false,
      message: "Falta configurar HF_CREDENTIALS en el servidor.",
      reason: "missing_credentials",
    };
  }

  if (!hasValidCredentialsShape(credentials)) {
    return {
      ok: false,
      message: "HF_CREDENTIALS debe tener el formato KEY_ID:KEY_SECRET.",
      reason: "invalid_credentials_format",
    };
  }

  try {
    createHiggsfieldClient({ credentials });
  } catch {
    return {
      ok: false,
      message: "No se pudo inicializar el SDK de Higgsfield en el servidor.",
      reason: "sdk_error",
    };
  }

  return {
    ok: true,
    message: "Conexion con Higgsfield configurada correctamente.",
  };
}
