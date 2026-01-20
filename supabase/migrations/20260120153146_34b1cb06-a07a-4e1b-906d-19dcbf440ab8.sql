-- Create announcements table for single shared note
CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL DEFAULT '',
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Authenticated users can view
CREATE POLICY "Authenticated users can view announcements"
ON public.announcements
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Authenticated users can update
CREATE POLICY "Authenticated users can update announcements"
ON public.announcements
FOR UPDATE
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Authenticated users can insert (for initial creation)
CREATE POLICY "Authenticated users can insert announcements"
ON public.announcements
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Insert initial empty announcement
INSERT INTO public.announcements (content) VALUES ('');