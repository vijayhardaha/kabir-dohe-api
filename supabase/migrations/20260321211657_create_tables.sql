-- Create tables for categories, tags, posts, and post_tags

CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  meta_description text,
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

CREATE TABLE public.tags (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  meta_description text,
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  identifier text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  post_number integer NOT NULL,
  post_order integer NOT NULL,
  text_hi text NOT NULL,
  text_en text NOT NULL,
  meaning_hi text,
  meaning_en text,
  interpretation_hi text,
  interpretation_en text,
  philosophical_analysis_hi text,
  philosophical_analysis_en text,
  practical_example_hi text,
  practical_example_en text,
  practice_guidance_hi text,
  practice_guidance_en text,
  core_message_hi text,
  core_message_en text,
  reflection_questions_hi text,
  reflection_questions_en text,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  is_popular boolean DEFAULT FALSE,
  is_featured boolean DEFAULT FALSE,
  view_count integer DEFAULT 0,
  post_status text NOT NULL DEFAULT 'draft',
  search_content text GENERATED ALWAYS AS (
    text_hi || ' ' || COALESCE(meaning_hi, '') || ' ' || COALESCE(interpretation_hi, '') || ' ' || COALESCE(philosophical_analysis_hi, '') || ' ' || COALESCE(core_message_hi, '') || ' ' || text_en || ' ' || COALESCE(meaning_en, '') || ' ' || COALESCE(interpretation_en, '') || ' ' || COALESCE(philosophical_analysis_en, '') || ' ' || COALESCE(core_message_en, '')
  ) STORED,
  search_text text GENERATED ALWAYS AS (
    text_hi || ' ' || text_en
  ) STORED,
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

CREATE TABLE public.post_tags (
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);
