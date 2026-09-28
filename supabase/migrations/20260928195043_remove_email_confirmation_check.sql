-- Email confirmation is disabled (see auth.email.enable_confirmations in
-- config.toml) now that signup is already gated by approved_emails, so
-- has_account no longer needs to check email_confirmed_at.
create or replace function public.list_approved_emails()
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
      ) as has_account
    from public.approved_emails ae
    order by ae.created_at desc;
end;
$$;
