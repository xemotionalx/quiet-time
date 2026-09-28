-- Display names no longer need to be unique; usernames take over that role.
drop index public.profiles_display_name_unique_idx;
drop function public.is_display_name_available(text);

alter table public.profiles add column username text;

-- Backfill: lowercase email prefix, stripped to a-z0-9_, capped at 25 chars
-- (falling back to "user" if that's empty), plus the first 4 chars of the
-- profile id (dashes removed) to keep it unique.
with base as (
  select
    p.id,
    nullif(
      substr(
        regexp_replace(lower(split_part(u.email, '@', 1)), '[^a-z0-9_]', '', 'g'),
        1, 25
      ),
      ''
    ) as base_username
  from public.profiles p
  join auth.users u on u.id = p.id
)
update public.profiles p
set username = coalesce(b.base_username, 'user') || substr(replace(p.id::text, '-', ''), 1, 4)
from base b
where b.id = p.id;

alter table public.profiles
  alter column username set not null,
  add constraint profiles_username_key unique (username),
  add constraint profiles_username_format check (
    username ~ '^[a-z0-9._]{3,30}$'
    and username !~ '(^\.|\.$|\.\.)'
  );

-- Set display_name and username from signup metadata, generating a
-- collision-proof username when one wasn't supplied.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  chosen_name text;
  chosen_username text;
  generated_base text;
begin
  chosen_name := trim(new.raw_user_meta_data->>'display_name');

  if chosen_name is null or chosen_name = '' then
    chosen_name := split_part(new.email, '@', 1);
  end if;

  chosen_username := lower(trim(new.raw_user_meta_data->>'username'));

  if chosen_username is null or chosen_username = '' then
    generated_base := nullif(
      substr(
        regexp_replace(lower(split_part(new.email, '@', 1)), '[^a-z0-9_]', '', 'g'),
        1, 25
      ),
      ''
    );
    chosen_username := coalesce(generated_base, 'user') || substr(replace(new.id::text, '-', ''), 1, 4);
  end if;

  insert into public.profiles (id, display_name, username)
  values (new.id, chosen_name, chosen_username);
  return new;
end;
$$;

-- Lets signed-out users check username availability without being able to read profiles.
create function public.is_username_available(name text)
returns boolean
language sql
security definer set search_path = ''
stable
as $$
  select not exists (
    select 1
    from public.profiles p
    where p.username = lower(trim(name))
  );
$$;

revoke execute on function public.is_username_available(text) from public;
grant execute on function public.is_username_available(text) to anon, authenticated;
