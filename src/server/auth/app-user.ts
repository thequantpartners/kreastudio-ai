import { auth, currentUser } from "@clerk/nextjs/server";
import { createSupabaseServiceClient } from "@/server/db/supabase";

export type AppUserSession = {
  id: string;
  clerkUserId: string;
  email: string | null;
  name: string | null;
  imageUrl: string | null;
  creditBalance: number;
};

type AppUserRow = {
  id: string;
  clerk_user_id: string;
  email: string | null;
  name: string | null;
  image_url: string | null;
};

type CreditAccountRow = {
  balance: number;
};

function buildDisplayName(user: Awaited<ReturnType<typeof currentUser>>) {
  if (!user) return null;
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();

  return fullName || user.username || null;
}

export async function getAuthenticatedAppUser(): Promise<AppUserSession> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await currentUser();

  if (!user) {
    throw new Error("No se pudo leer el usuario autenticado.");
  }

  const email = user.primaryEmailAddress?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? null;
  const name = buildDisplayName(user);
  const imageUrl = user.imageUrl ?? null;
  const supabase = createSupabaseServiceClient();

  const { data: appUser, error: userError } = await supabase
    .from("app_users")
    .upsert(
      {
        clerk_user_id: userId,
        email,
        name,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "clerk_user_id" }
    )
    .select("id, clerk_user_id, email, name, image_url")
    .single<AppUserRow>();

  if (userError || !appUser) {
    throw new Error(userError?.message ?? "No se pudo sincronizar el usuario.");
  }

  const { error: accountCreateError } = await supabase
    .from("credit_accounts")
    .upsert({ user_id: appUser.id }, { onConflict: "user_id", ignoreDuplicates: true });

  if (accountCreateError) {
    throw new Error(accountCreateError.message);
  }

  const { data: account, error: accountReadError } = await supabase
    .from("credit_accounts")
    .select("balance")
    .eq("user_id", appUser.id)
    .single<CreditAccountRow>();

  if (accountReadError || !account) {
    throw new Error(accountReadError?.message ?? "No se pudo leer el saldo de creditos.");
  }

  return {
    id: appUser.id,
    clerkUserId: appUser.clerk_user_id,
    email: appUser.email,
    name: appUser.name,
    imageUrl: appUser.image_url,
    creditBalance: account.balance,
  };
}
