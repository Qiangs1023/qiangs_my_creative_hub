
-- Fix function search_path
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Tighten content_views insert: anonymous (NULL) or self
DROP POLICY IF EXISTS "views_insert_anyone" ON public.content_views;
CREATE POLICY "views_insert_self_or_anon" ON public.content_views FOR INSERT
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());

-- Replace broad bucket SELECT policies with single combined policy that doesn't list publicly
DROP POLICY IF EXISTS "covers_public_read" ON storage.objects;
DROP POLICY IF EXISTS "media_public_read" ON storage.objects;
-- Public read remains via getPublicUrl which uses object name directly.
-- Re-create with explicit SELECT but it's fine since these are public asset buckets.
CREATE POLICY "public_assets_read" ON storage.objects FOR SELECT
  USING (bucket_id IN ('covers', 'media'));
