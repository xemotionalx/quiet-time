-- Tracks whether the user has gone through the post-verification profile
-- setup step (choosing a username and display name). New signups no longer
-- send username/display_name metadata, so handle_new_user()'s existing
-- fallback generation fills placeholders that must be replaced before the
-- user can reach the home screen.
alter table public.profiles
  add column profile_completed boolean not null default false;

-- Existing profiles were already set up under the old flow (where username
-- and display name were collected at signup); don't force them through the
-- new completion screen.
update public.profiles set profile_completed = true;
