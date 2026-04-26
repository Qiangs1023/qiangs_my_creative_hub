
-- =====================================================
-- 1. ROLES SYSTEM (separate table to prevent privilege escalation)
-- =====================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Security definer function (avoids recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Auto create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  -- Default role
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =====================================================
-- 2. CONTENT TABLES (work, writing, videos, courses)
-- =====================================================
CREATE TABLE public.work (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_url TEXT,
  url TEXT,
  status TEXT,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.writing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_url TEXT,
  read_time TEXT,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_url TEXT,
  video_url TEXT,
  duration TEXT,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_url TEXT,
  price_cents INT NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  level TEXT,
  duration TEXT,
  lessons INT,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_path TEXT,
  duration TEXT,
  is_free BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_work_updated BEFORE UPDATE ON public.work FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_writing_updated BEFORE UPDATE ON public.writing FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_videos_updated BEFORE UPDATE ON public.videos FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_courses_updated BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_lessons_updated BEFORE UPDATE ON public.course_lessons FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =====================================================
-- 3. USER BEHAVIOR & ENROLLMENTS
-- =====================================================
CREATE TYPE public.content_kind AS ENUM ('work', 'writing', 'videos', 'courses');

CREATE TABLE public.content_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  kind content_kind NOT NULL,
  slug TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_content_views_kind_slug ON public.content_views (kind, slug);
CREATE INDEX idx_content_views_user ON public.content_views (user_id);

CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active',
  progress_percent INT NOT NULL DEFAULT 0,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)
);

-- =====================================================
-- 4. RLS POLICIES
-- =====================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.writing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- profiles: own + admin
CREATE POLICY "profiles_select_self_or_admin" ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "profiles_update_self" ON public.profiles FOR UPDATE
  USING (auth.uid() = id);
CREATE POLICY "profiles_admin_all" ON public.profiles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- user_roles: only admin can read/write; users can read own
CREATE POLICY "user_roles_select_self_or_admin" ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "user_roles_admin_write" ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- public content: everyone can read published; admin writes
CREATE POLICY "work_public_read" ON public.work FOR SELECT
  USING (published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "work_admin_write" ON public.work FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "writing_public_read" ON public.writing FOR SELECT
  USING (published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "writing_admin_write" ON public.writing FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "videos_public_read" ON public.videos FOR SELECT
  USING (published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "videos_admin_write" ON public.videos FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "courses_public_read" ON public.courses FOR SELECT
  USING (published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "courses_admin_write" ON public.courses FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- course lessons: enrolled users see all; others see free; admin all
CREATE POLICY "lessons_read" ON public.course_lessons FOR SELECT
  USING (
    is_free = true
    OR public.has_role(auth.uid(), 'admin')
    OR EXISTS (
      SELECT 1 FROM public.enrollments
      WHERE enrollments.user_id = auth.uid() AND enrollments.course_id = course_lessons.course_id
    )
  );
CREATE POLICY "lessons_admin_write" ON public.course_lessons FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- content_views: anyone can insert; admin and self can read
CREATE POLICY "views_insert_anyone" ON public.content_views FOR INSERT
  WITH CHECK (true);
CREATE POLICY "views_read_self_or_admin" ON public.content_views FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- enrollments: own + admin
CREATE POLICY "enrollments_self_read" ON public.enrollments FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "enrollments_admin_write" ON public.enrollments FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- 5. STORAGE BUCKETS
-- =====================================================
INSERT INTO storage.buckets (id, name, public) VALUES
  ('covers', 'covers', true),
  ('media', 'media', true),
  ('course-videos', 'course-videos', false)
ON CONFLICT (id) DO NOTHING;

-- Public buckets: anyone reads, admin writes
CREATE POLICY "covers_public_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'covers');
CREATE POLICY "covers_admin_write" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'covers' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "covers_admin_update" ON storage.objects FOR UPDATE
  USING (bucket_id = 'covers' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "covers_admin_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'covers' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "media_public_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'media');
CREATE POLICY "media_admin_write" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "media_admin_update" ON storage.objects FOR UPDATE
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "media_admin_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

-- Private course videos: enrolled or admin
CREATE POLICY "course_videos_read_enrolled" ON storage.objects FOR SELECT
  USING (
    bucket_id = 'course-videos' AND (
      public.has_role(auth.uid(), 'admin')
      OR EXISTS (
        SELECT 1 FROM public.course_lessons cl
        JOIN public.enrollments e ON e.course_id = cl.course_id
        WHERE cl.video_path = storage.objects.name AND e.user_id = auth.uid()
      )
    )
  );
CREATE POLICY "course_videos_admin_write" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'course-videos' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "course_videos_admin_update" ON storage.objects FOR UPDATE
  USING (bucket_id = 'course-videos' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "course_videos_admin_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'course-videos' AND public.has_role(auth.uid(), 'admin'));
