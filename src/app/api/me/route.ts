import { NextResponse } from "next/server";
import { getAuthenticatedAppUser } from "@/server/auth/app-user";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getAuthenticatedAppUser();

    return NextResponse.json({
      ok: true,
      user,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo leer el usuario.";

    return NextResponse.json(
      {
        ok: false,
        message,
      },
      { status: message === "Unauthorized" ? 401 : 500 }
    );
  }
}
