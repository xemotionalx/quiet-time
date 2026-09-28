create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  color text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- RLS is already on thanks to automatic RLS; now add policies
create policy "Members can view all profiles"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Members can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Auto-create a profile whenever a user is added
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, split_part(new.email, '@', 1));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();