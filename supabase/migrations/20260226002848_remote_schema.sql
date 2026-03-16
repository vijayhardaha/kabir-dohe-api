-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "hypopg" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "index_advisor" WITH SCHEMA "extensions";

-- 2. Tables
CREATE TABLE "public"."couplets" (
  "id" uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  "couplet_number" integer NOT NULL,
  "couplet_order" integer NOT NULL,
  "couplet_code" text NOT NULL UNIQUE,
  "slug" text NOT NULL UNIQUE,
  "hindi_text" text NOT NULL,
  "english_text" text NOT NULL,
  "hindi_translation" text NOT NULL,
  "english_translation" text NOT NULL,
  "hindi_explanation" text NOT NULL,
  "english_explanation" text NOT NULL,
  "popular" boolean DEFAULT false,
  "featured" boolean DEFAULT false,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE "public"."tags" (
  "id" uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  "slug" text NOT NULL UNIQUE,
  "name" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now()
);

CREATE TABLE "public"."couplet_tags" (
  "couplet_id" uuid NOT NULL REFERENCES public.couplets(id) ON DELETE CASCADE,
  "tag_id" uuid NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (couplet_id, tag_id)
);

-- 3. Enable RLS on all tables
ALTER TABLE "public"."couplets" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."tags" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."couplet_tags" ENABLE ROW LEVEL SECURITY;

-- 4. Functions
-- Secure hash check (Keep your hash secret safe!)
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

-- Updated_at trigger function
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

-- 5. RLS Policies
-- NOTE: Policies apply to 'anon' as you are using a custom header key in the client

-- Couplets
CREATE POLICY "Public Read Couplets" ON "public"."couplets" FOR SELECT TO anon USING (true);
CREATE POLICY "Admin Insert Couplets" ON "public"."couplets" FOR INSERT TO anon WITH CHECK (public.is_hash_authorized());
CREATE POLICY "Admin Update Couplets" ON "public"."couplets" FOR UPDATE TO anon USING (public.is_hash_authorized());

-- Tags
CREATE POLICY "Public Read Tags" ON "public"."tags" FOR SELECT TO anon USING (true);
CREATE POLICY "Admin Insert Tags" ON "public"."tags" FOR INSERT TO anon WITH CHECK (public.is_hash_authorized());
CREATE POLICY "Admin Update Tags" ON "public"."tags" FOR UPDATE TO anon USING (public.is_hash_authorized());

-- Couplet Tags (Junction Table)
CREATE POLICY "Public Read Couplet_Tags" ON "public"."couplet_tags" FOR SELECT TO anon USING (true);
CREATE POLICY "Admin Insert Couplet_Tags" ON "public"."couplet_tags" FOR INSERT TO anon WITH CHECK (public.is_hash_authorized());
CREATE POLICY "Admin Update Couplet_Tags" ON "public"."couplet_tags" FOR UPDATE TO anon USING (public.is_hash_authorized());

-- 6. Triggers
CREATE TRIGGER update_couplets_updated_at
  BEFORE UPDATE ON public.couplets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tags_updated_at
  BEFORE UPDATE ON public.tags
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
