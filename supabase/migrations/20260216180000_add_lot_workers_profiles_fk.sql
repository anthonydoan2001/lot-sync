-- Add direct FK from lot_workers.user_id to profiles.id
-- so PostgREST can resolve the join for fetching worker display names
ALTER TABLE public.lot_workers
  ADD CONSTRAINT lot_workers_user_id_profiles_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id);
