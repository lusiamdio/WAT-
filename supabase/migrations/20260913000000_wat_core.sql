-- WAT core production schema. Apply with `supabase db push` before enabling the app.
create extension if not exists pgcrypto;

create type public.membership_role as enum ('owner', 'admin', 'member', 'support');
create type public.checkout_status as enum ('pending', 'completed', 'abandoned', 'cancelled');
create type public.order_status as enum ('pending_payment', 'paid', 'fulfilled', 'cancelled', 'refunded');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text not null check (char_length(display_name) between 1 and 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 160),
  created_at timestamptz not null default now()
);

create table public.organization_memberships (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.membership_role not null default 'member',
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create table public.checkout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  currency char(3) not null check (currency ~ '^[A-Z]{3}$'),
  subtotal numeric(14,2) not null check (subtotal >= 0),
  discount numeric(14,2) not null default 0 check (discount >= 0),
  tax numeric(14,2) not null default 0 check (tax >= 0),
  shipping numeric(14,2) not null default 0 check (shipping >= 0),
  total numeric(14,2) not null check (total >= 0),
  idempotency_key uuid not null unique,
  status public.checkout_status not null default 'pending',
  customer jsonb not null check (jsonb_typeof(customer) = 'object'),
  items jsonb not null check (jsonb_typeof(items) = 'array'),
  expires_at timestamptz not null default now() + interval '30 minutes',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index checkout_sessions_user_status_idx on public.checkout_sessions(user_id, status, created_at desc);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  checkout_session_id uuid unique references public.checkout_sessions(id) on delete restrict,
  status public.order_status not null default 'pending_payment',
  currency char(3) not null check (currency ~ '^[A-Z]{3}$'),
  total numeric(14,2) not null check (total >= 0),
  provider text not null,
  provider_payment_id text unique,
  order_snapshot jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index orders_user_created_idx on public.orders(user_id, created_at desc);

create table public.audit_events (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null check (char_length(action) <= 100),
  entity_type text not null check (char_length(entity_type) <= 100),
  entity_id text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at() returns trigger language plpgsql security invoker as $$
begin new.updated_at = now(); return new; end;
$$;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger checkout_sessions_set_updated_at before update on public.checkout_sessions for each row execute function public.set_updated_at();
create trigger orders_set_updated_at before update on public.orders for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.organization_memberships enable row level security;
alter table public.checkout_sessions enable row level security;
alter table public.orders enable row level security;
alter table public.audit_events enable row level security;

create policy "profiles are visible to their owner" on public.profiles for select using (id = auth.uid());
create policy "profiles are editable by their owner" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "members can view their memberships" on public.organization_memberships for select using (user_id = auth.uid());
create policy "users manage their checkout sessions" on public.checkout_sessions for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "users can view their orders" on public.orders for select using (user_id = auth.uid());
create policy "users can view their audit events" on public.audit_events for select using (actor_id = auth.uid());

-- Profile provisioning must run with definer privileges because auth.users is not directly writable by clients.
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, coalesce(new.email, ''), coalesce(new.raw_user_meta_data->>'display_name', split_part(coalesce(new.email, 'WAT user'), '@', 1)));
  return new;
end;
$$;
create trigger auth_user_profile after insert on auth.users for each row execute function public.handle_new_user();
