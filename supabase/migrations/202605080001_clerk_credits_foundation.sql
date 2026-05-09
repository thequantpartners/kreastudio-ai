create extension if not exists pgcrypto;

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text unique not null,
  email text,
  name text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.credit_accounts (
  user_id uuid primary key references public.app_users(id) on delete cascade,
  balance integer not null default 0 check (balance >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.credit_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.app_users(id) on delete cascade,
  delta integer not null,
  balance_after integer not null,
  reason text not null,
  external_reference text unique,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.app_users(id) on delete cascade,
  provider text not null default 'mercado_pago',
  provider_payment_id text unique,
  external_reference text unique not null,
  pack_id text not null,
  amount_cents integer not null,
  currency text not null,
  status text not null,
  credits integer not null,
  raw jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists credit_ledger_user_id_created_at_idx
  on public.credit_ledger(user_id, created_at desc);

create index if not exists payment_transactions_user_id_created_at_idx
  on public.payment_transactions(user_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists app_users_set_updated_at on public.app_users;
create trigger app_users_set_updated_at
before update on public.app_users
for each row execute function public.set_updated_at();

drop trigger if exists credit_accounts_set_updated_at on public.credit_accounts;
create trigger credit_accounts_set_updated_at
before update on public.credit_accounts
for each row execute function public.set_updated_at();

drop trigger if exists payment_transactions_set_updated_at on public.payment_transactions;
create trigger payment_transactions_set_updated_at
before update on public.payment_transactions
for each row execute function public.set_updated_at();

create or replace function public.credit_mercado_pago_payment(
  p_external_reference text,
  p_provider_payment_id text,
  p_status text,
  p_raw jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_transaction public.payment_transactions%rowtype;
  v_balance integer;
  v_ledger_id uuid;
begin
  select *
    into v_transaction
    from public.payment_transactions
   where external_reference = p_external_reference
      or (p_provider_payment_id is not null and provider_payment_id = p_provider_payment_id)
   for update;

  if not found then
    return jsonb_build_object(
      'credited', false,
      'reason', 'transaction_not_found',
      'externalReference', p_external_reference
    );
  end if;

  update public.payment_transactions
     set provider_payment_id = coalesce(p_provider_payment_id, provider_payment_id),
         status = p_status,
         raw = coalesce(p_raw, '{}'::jsonb)
   where id = v_transaction.id
   returning * into v_transaction;

  if p_status <> 'approved' then
    return jsonb_build_object(
      'credited', false,
      'paymentStatus', p_status,
      'externalReference', v_transaction.external_reference
    );
  end if;

  select id
    into v_ledger_id
    from public.credit_ledger
   where external_reference = v_transaction.external_reference;

  if v_ledger_id is not null then
    select balance
      into v_balance
      from public.credit_accounts
     where user_id = v_transaction.user_id;

    return jsonb_build_object(
      'credited', false,
      'alreadyCredited', true,
      'credits', v_transaction.credits,
      'balance', v_balance,
      'externalReference', v_transaction.external_reference
    );
  end if;

  insert into public.credit_accounts(user_id, balance)
  values (v_transaction.user_id, 0)
  on conflict (user_id) do nothing;

  select balance
    into v_balance
    from public.credit_accounts
   where user_id = v_transaction.user_id
   for update;

  v_balance := v_balance + v_transaction.credits;

  update public.credit_accounts
     set balance = v_balance
   where user_id = v_transaction.user_id;

  insert into public.credit_ledger(
    user_id,
    delta,
    balance_after,
    reason,
    external_reference,
    metadata
  )
  values (
    v_transaction.user_id,
    v_transaction.credits,
    v_balance,
    'mercado_pago_purchase',
    v_transaction.external_reference,
    jsonb_build_object(
      'providerPaymentId', p_provider_payment_id,
      'packId', v_transaction.pack_id,
      'paymentTransactionId', v_transaction.id
    )
  );

  return jsonb_build_object(
    'credited', true,
    'credits', v_transaction.credits,
    'balance', v_balance,
    'externalReference', v_transaction.external_reference
  );
end;
$$;
