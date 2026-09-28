-- Case-insensitive uniqueness for display names.
-- Checked existing profiles for case-insensitive duplicates before adding this: none found.
create unique index profiles_display_name_unique_idx on public.profiles (lower(display_name));

-- Set display_name from signup metadata, falling back to a collision-proof default.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  chosen_name text;
begin
  chosen_name := trim(new.raw_user_meta_data->>'display_name');

  if chosen_name is null or chosen_name = '' then
    chosen_name := split_part(new.email, '@', 1) || '_' || substr(new.id::text, 1, 4);
  end if;

  insert into public.profiles (id, display_name)
  values (new.id, chosen_name);
  return new;
end;
$$;

-- Lets signed-out users check name availability without being able to read profiles.
create function public.is_display_name_available(name text)
returns boolean
language sql
security definer set search_path = ''
stable
as $$
  select not exists (
    select 1
    from public.profiles p
    where lower(p.display_name) = lower(trim(name))
  );
$$;

revoke execute on function public.is_display_name_available(text) from public;
grant execute on function public.is_display_name_available(text) to anon, authenticated;
