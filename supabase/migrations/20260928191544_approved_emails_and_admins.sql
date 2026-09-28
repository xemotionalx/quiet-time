-- Only pre-approved emails may sign up. Enforced by a Before User Created
-- auth hook (public.hook_before_user_created) rather than in the app, so it
-- can't be bypassed by calling the Auth API directly.

create table public.approved_emails (
  email text primary key check (email = lower(trim(email))),
  created_at timestamptz not null default now(),
  added_by uuid references auth.users(id) on delete set null default auth.uid()
);

alter table public.approved_emails enable row level security;

-- Backfill so every existing account is already on the list.
insert into public.approved_emails (email)
select distinct lower(trim(email))
from auth.users
where email is not null
on conflict (email) do nothing;

-- Admins table. RLS is enabled with no policies at all: the app (anon or
-- authenticated) must never be able to read or write this directly. Only
-- security definer functions (is_admin, list_approved_emails) touch it.
create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

create function public.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- Admins can manage the approved list; nobody can update an existing row
-- (remove and re-add instead).
create policy "Admins can view approved emails"
  on public.approved_emails for select
  to authenticated
  using ((select public.is_admin()));

create policy "Admins can add approved emails"
  on public.approved_emails for insert
  to authenticated
  with check ((select public.is_admin()));

create policy "Admins can remove approved emails"
  on public.approved_emails for delete
  to authenticated
  using ((select public.is_admin()));

-- Security definer so it can join auth.users (not otherwise readable by the
-- authenticated role) to report whether each approved email has signed up.
create function public.list_approved_emails()
returns table (email text, created_at timestamptz, has_account boolean)
language plpgsql
security definer
set search_path = ''
stable
as $$
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;

  return query
    select
      ae.email,
      ae.created_at,
      exists (
        select 1
        from auth.users u
        where lower(u.email) = ae.email
          and u.email_confirmed_at is not null
      ) as has_account
    from public.approved_emails ae
    order by ae.created_at desc;
end;
$$;

revoke execute on function public.list_approved_emails() from public, anon;
grant execute on function public.list_approved_emails() to authenticated;

-- Before User Created auth hook. Per the docs, hook functions should NOT be
-- security definer — instead Auth calls this as supabase_auth_admin, which
-- is granted exactly the access it needs below.
create function public.hook_before_user_created(event jsonb)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
  new_email text;
begin
  new_email := lower(trim(event->'user'->>'email'));

  if exists (select 1 from public.approved_emails where email = new_email) then
    return '{}'::jsonb;
  end if;

  return jsonb_build_object(
    'error', jsonb_build_object(
      'http_code', 403,
      'message', 'This email isn''t on the Quiet Time list. Ask an admin to add you.'
    )
  );
end;
$$;

grant usage on schema public to supabase_auth_admin;
grant execute on function public.hook_before_user_created(jsonb) to supabase_auth_admin;
revoke execute on function public.hook_before_user_created(jsonb) from authenticated, anon, public;

grant select on public.approved_emails to supabase_auth_admin;

create policy "Auth admin can read approved emails"
  on public.approved_emails for select
  to supabase_auth_admin
  using (true);
