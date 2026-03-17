-- 1. EXTENSIONS
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS "hypopg" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "index_advisor" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pg_trgm" WITH SCHEMA "extensions";

-- 2. TABLES
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  meta_title text,
  meta_description text,
  meta_keywords text[],
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

CREATE TABLE public.tags (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  meta_title text,
  meta_description text,
  meta_keywords text[],
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

CREATE TABLE public.posts (
  -- primary key
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),

  -- ordering and identification
  identifier text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  post_number integer NOT NULL,
  post_order integer NOT NULL,

  -- original content
  text_hi text NOT NULL,
  text_en text NOT NULL,

  -- interpretation
  interpretation_hi text,
  interpretation_en text,

  -- philosophical analysis
  philosophical_analysis_hi text,
  philosophical_analysis_en text,

  -- real world example
  practical_example_hi text,
  practical_example_en text,

  -- spiritual practice guidance
  practice_guidance_hi text,
  practice_guidance_en text,

  -- core message
  core_message_hi text,
  core_message_en text,

  -- reflection questions
  reflection_questions_hi text,
  reflection_questions_en text,

  -- classification
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,

  -- flags
  is_popular boolean DEFAULT FALSE,
  is_featured boolean DEFAULT FALSE,

  -- seo
  meta_title text,
  meta_description text,
  meta_keywords text[],

  -- analytics
  view_count integer DEFAULT 0,

  -- search content
  search_content_hi text GENERATED ALWAYS AS (
    text_hi || ' ' || interpretation_hi || ' ' || philosophical_analysis_hi || ' ' || core_message_hi
  ) STORED,

  search_content_en text GENERATED ALWAYS AS (
    text_en || ' ' || interpretation_en || ' ' || philosophical_analysis_en || ' ' || core_message_en
  ) STORED,

  -- timestamps
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

CREATE TABLE public.post_tags (
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- 3. ENABLE RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;

-- 4. FUNCTIONS
CREATE OR REPLACE FUNCTION public.is_hash_authorized()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  RETURN (current_setting('request.headers', true)::json->>'x-hash-key' = '6c361452ebd23a942b1a424309f32f972614b5833bdd32da5a441700e82cc7cd');
EXCEPTION WHEN OTHERS THEN
  RETURN false;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO ''
AS $function$
BEGIN
  NEW.updated_at = pg_catalog.now();
  RETURN NEW;
END;
$function$;

-- 5. RLS POLICIES
-- Posts
CREATE POLICY "Public Read Posts" ON public.posts FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Admin Insert Posts" ON public.posts FOR INSERT TO anon WITH CHECK (public.is_hash_authorized());
CREATE POLICY "Admin Update Posts" ON public.posts FOR UPDATE TO anon USING (public.is_hash_authorized());
CREATE POLICY "Admin Delete Posts" ON public.posts FOR DELETE TO anon USING (public.is_hash_authorized());

-- Tags
CREATE POLICY "Public Read Tags" ON public.tags FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Admin Insert Tags" ON public.tags FOR INSERT TO anon WITH CHECK (public.is_hash_authorized());
CREATE POLICY "Admin Update Tags" ON public.tags FOR UPDATE TO anon USING (public.is_hash_authorized());
CREATE POLICY "Admin Delete Tags" ON public.tags FOR DELETE TO anon USING (public.is_hash_authorized());

-- Categories
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Admin Insert Categories" ON public.categories FOR INSERT TO anon WITH CHECK (public.is_hash_authorized());
CREATE POLICY "Admin Update Categories" ON public.categories FOR UPDATE TO anon USING (public.is_hash_authorized());
CREATE POLICY "Admin Delete Categories" ON public.categories FOR DELETE TO anon USING (public.is_hash_authorized());

-- Post Tags
CREATE POLICY "Public Read Post_Tags" ON public.post_tags FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Admin All Post_Tags" ON public.post_tags FOR ALL TO anon USING (public.is_hash_authorized());

-- 6. TRIGGERS
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON public.tags FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7. INDICES
-- Filtering and Sorting
CREATE INDEX idx_posts_category_id ON public.posts(category_id);
CREATE INDEX idx_posts_post_order ON public.posts(post_order ASC);
CREATE INDEX idx_posts_view_count ON public.posts(view_count DESC);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);

-- Partial Indices for Performance
CREATE INDEX idx_posts_is_popular ON public.posts(is_popular) WHERE is_popular IS TRUE;
CREATE INDEX idx_posts_is_featured ON public.posts(is_featured) WHERE is_featured IS TRUE;

-- Composite for Category Browsing
CREATE INDEX idx_posts_category_order ON public.posts(category_id, post_order);

-- Junction Table
CREATE INDEX idx_post_tags_tag_id ON public.post_tags(tag_id);

-- Trigram Search (requires pg_trgm)
CREATE INDEX idx_posts_text_hi_search ON public.posts USING GIN (text_hi gin_trgm_ops);
CREATE INDEX idx_posts_text_en_search ON public.posts USING GIN (text_en gin_trgm_ops);
CREATE INDEX idx_posts_search_hi ON public.posts USING GIN (search_content_hi gin_trgm_ops);
CREATE INDEX idx_posts_search_en ON public.posts USING GIN (search_content_en gin_trgm_ops);
