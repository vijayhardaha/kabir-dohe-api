create extension if not exists "hypopg" with schema "extensions";

create extension if not exists "index_advisor" with schema "extensions";

drop extension if exists "pg_net";


  create table "public"."couplet_tags" (
    "couplet_id" uuid not null,
    "tag_id" uuid not null
      );


alter table "public"."couplet_tags" enable row level security;


  create table "public"."couplets" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "couplet_number" integer not null,
    "couplet_order" integer not null,
    "couplet_code" text not null,
    "slug" text not null,
    "hindi_text" text not null,
    "english_text" text not null,
    "hindi_translation" text not null,
    "english_translation" text not null,
    "hindi_explanation" text not null,
    "english_explanation" text not null,
    "is_popular" boolean default false,
    "is_featured" boolean default false,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."couplets" enable row level security;


  create table "public"."tags" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "slug" text not null,
    "name" text not null
      );


alter table "public"."tags" enable row level security;

CREATE UNIQUE INDEX couplet_tags_pkey ON public.couplet_tags USING btree (couplet_id, tag_id);

CREATE UNIQUE INDEX couplets_couplet_code_key ON public.couplets USING btree (couplet_code);

CREATE UNIQUE INDEX couplets_pkey ON public.couplets USING btree (id);

CREATE UNIQUE INDEX couplets_slug_key ON public.couplets USING btree (slug);

CREATE UNIQUE INDEX tags_pkey ON public.tags USING btree (id);

CREATE UNIQUE INDEX tags_slug_key ON public.tags USING btree (slug);

alter table "public"."couplet_tags" add constraint "couplet_tags_pkey" PRIMARY KEY using index "couplet_tags_pkey";

alter table "public"."couplets" add constraint "couplets_pkey" PRIMARY KEY using index "couplets_pkey";

alter table "public"."tags" add constraint "tags_pkey" PRIMARY KEY using index "tags_pkey";

alter table "public"."couplet_tags" add constraint "couplet_tags_couplet_id_fkey" FOREIGN KEY (couplet_id) REFERENCES public.couplets(id) ON DELETE CASCADE not valid;

alter table "public"."couplet_tags" validate constraint "couplet_tags_couplet_id_fkey";

alter table "public"."couplet_tags" add constraint "couplet_tags_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE not valid;

alter table "public"."couplet_tags" validate constraint "couplet_tags_tag_id_fkey";

alter table "public"."couplets" add constraint "couplets_couplet_code_key" UNIQUE using index "couplets_couplet_code_key";

alter table "public"."couplets" add constraint "couplets_slug_key" UNIQUE using index "couplets_slug_key";

alter table "public"."tags" add constraint "tags_slug_key" UNIQUE using index "tags_slug_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.is_hash_authorized()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$BEGIN
  RETURN (current_setting('request.headers', true)::json->>'x-hash-key' = '33dbb18c1c71f8205871712b0ea6cbbbe924f9eac4a7fb601d412eaaba85454a');
EXCEPTION WHEN OTHERS THEN
  RETURN false;
END;$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  NEW.updated_at = pg_catalog.now();  -- Qualified built-in function
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."couplet_tags" to "public";

grant insert on table "public"."couplet_tags" to "public";

grant references on table "public"."couplet_tags" to "public";

grant select on table "public"."couplet_tags" to "public";

grant trigger on table "public"."couplet_tags" to "public";

grant truncate on table "public"."couplet_tags" to "public";

grant update on table "public"."couplet_tags" to "public";

grant delete on table "public"."couplet_tags" to "anon";

grant insert on table "public"."couplet_tags" to "anon";

grant references on table "public"."couplet_tags" to "anon";

grant select on table "public"."couplet_tags" to "anon";

grant trigger on table "public"."couplet_tags" to "anon";

grant truncate on table "public"."couplet_tags" to "anon";

grant update on table "public"."couplet_tags" to "anon";

grant delete on table "public"."couplet_tags" to "authenticated";

grant insert on table "public"."couplet_tags" to "authenticated";

grant references on table "public"."couplet_tags" to "authenticated";

grant select on table "public"."couplet_tags" to "authenticated";

grant trigger on table "public"."couplet_tags" to "authenticated";

grant truncate on table "public"."couplet_tags" to "authenticated";

grant update on table "public"."couplet_tags" to "authenticated";

grant delete on table "public"."couplet_tags" to "service_role";

grant insert on table "public"."couplet_tags" to "service_role";

grant references on table "public"."couplet_tags" to "service_role";

grant select on table "public"."couplet_tags" to "service_role";

grant trigger on table "public"."couplet_tags" to "service_role";

grant truncate on table "public"."couplet_tags" to "service_role";

grant update on table "public"."couplet_tags" to "service_role";

grant delete on table "public"."couplets" to "public";

grant insert on table "public"."couplets" to "public";

grant references on table "public"."couplets" to "public";

grant select on table "public"."couplets" to "public";

grant trigger on table "public"."couplets" to "public";

grant truncate on table "public"."couplets" to "public";

grant update on table "public"."couplets" to "public";

grant delete on table "public"."couplets" to "anon";

grant insert on table "public"."couplets" to "anon";

grant references on table "public"."couplets" to "anon";

grant select on table "public"."couplets" to "anon";

grant trigger on table "public"."couplets" to "anon";

grant truncate on table "public"."couplets" to "anon";

grant update on table "public"."couplets" to "anon";

grant delete on table "public"."couplets" to "authenticated";

grant insert on table "public"."couplets" to "authenticated";

grant references on table "public"."couplets" to "authenticated";

grant select on table "public"."couplets" to "authenticated";

grant trigger on table "public"."couplets" to "authenticated";

grant truncate on table "public"."couplets" to "authenticated";

grant update on table "public"."couplets" to "authenticated";

grant delete on table "public"."couplets" to "service_role";

grant insert on table "public"."couplets" to "service_role";

grant references on table "public"."couplets" to "service_role";

grant select on table "public"."couplets" to "service_role";

grant trigger on table "public"."couplets" to "service_role";

grant truncate on table "public"."couplets" to "service_role";

grant update on table "public"."couplets" to "service_role";

grant delete on table "public"."tags" to "public";

grant insert on table "public"."tags" to "public";

grant references on table "public"."tags" to "public";

grant select on table "public"."tags" to "public";

grant trigger on table "public"."tags" to "public";

grant truncate on table "public"."tags" to "public";

grant update on table "public"."tags" to "public";

grant delete on table "public"."tags" to "anon";

grant insert on table "public"."tags" to "anon";

grant references on table "public"."tags" to "anon";

grant select on table "public"."tags" to "anon";

grant trigger on table "public"."tags" to "anon";

grant truncate on table "public"."tags" to "anon";

grant update on table "public"."tags" to "anon";

grant delete on table "public"."tags" to "authenticated";

grant insert on table "public"."tags" to "authenticated";

grant references on table "public"."tags" to "authenticated";

grant select on table "public"."tags" to "authenticated";

grant trigger on table "public"."tags" to "authenticated";

grant truncate on table "public"."tags" to "authenticated";

grant update on table "public"."tags" to "authenticated";

grant delete on table "public"."tags" to "service_role";

grant insert on table "public"."tags" to "service_role";

grant references on table "public"."tags" to "service_role";

grant select on table "public"."tags" to "service_role";

grant trigger on table "public"."tags" to "service_role";

grant truncate on table "public"."tags" to "service_role";

grant update on table "public"."tags" to "service_role";


  create policy "Public Read"
  on "public"."couplet_tags"
  as permissive
  for select
  to anon
using (true);



  create policy "Secure Delete"
  on "public"."couplet_tags"
  as permissive
  for delete
  to anon
using (public.is_hash_authorized());



  create policy "Secure Insert"
  on "public"."couplet_tags"
  as permissive
  for insert
  to anon
with check (public.is_hash_authorized());



  create policy "Secure Update"
  on "public"."couplet_tags"
  as permissive
  for update
  to anon
using (public.is_hash_authorized())
with check (public.is_hash_authorized());



  create policy "Public Read"
  on "public"."couplets"
  as permissive
  for select
  to anon
using (true);



  create policy "Secure Delete"
  on "public"."couplets"
  as permissive
  for delete
  to anon
using (public.is_hash_authorized());



  create policy "Secure Insert"
  on "public"."couplets"
  as permissive
  for insert
  to anon
with check (public.is_hash_authorized());



  create policy "Secure Update"
  on "public"."couplets"
  as permissive
  for update
  to anon
using (public.is_hash_authorized())
with check (public.is_hash_authorized());



  create policy "Public Read"
  on "public"."tags"
  as permissive
  for select
  to anon
using (true);



  create policy "Secure Delete"
  on "public"."tags"
  as permissive
  for delete
  to anon
using (public.is_hash_authorized());



  create policy "Secure Insert"
  on "public"."tags"
  as permissive
  for insert
  to anon
with check (public.is_hash_authorized());



  create policy "Secure Update"
  on "public"."tags"
  as permissive
  for update
  to anon
using (public.is_hash_authorized())
with check (public.is_hash_authorized());


CREATE TRIGGER update_couplets_updated_at BEFORE UPDATE ON public.couplets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
