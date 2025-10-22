-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Allow all operations on lots" ON public.lots;
DROP POLICY IF EXISTS "Allow all operations on pallets" ON public.pallets;

-- Create secure RLS policies that require authentication for lots table
CREATE POLICY "Authenticated users can view lots"
ON public.lots FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert lots"
ON public.lots FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update lots"
ON public.lots FOR UPDATE
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete lots"
ON public.lots FOR DELETE
TO authenticated
USING (auth.uid() IS NOT NULL);

-- Create secure RLS policies that require authentication for pallets table
CREATE POLICY "Authenticated users can view pallets"
ON public.pallets FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert pallets"
ON public.pallets FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update pallets"
ON public.pallets FOR UPDATE
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete pallets"
ON public.pallets FOR DELETE
TO authenticated
USING (auth.uid() IS NOT NULL);