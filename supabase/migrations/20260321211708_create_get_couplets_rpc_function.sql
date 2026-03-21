-- Optimized RPC function for fetching couplets/posts.
-- Returns JSON for simpler structure and better performance.

DROP FUNCTION IF EXISTS public.get_couplets_for_api(jsonb);

CREATE OR REPLACE FUNCTION public.get_couplets_for_api(filters jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SET search_path = public, pg_catalog
AS $$
DECLARE
  search_query text := filters->>'search_query';
  search_content boolean := COALESCE((filters->>'search_content')::boolean, false);
  tag_list text := COALESCE(filters->>'tags', '');
  tag_array text[];
  category_slug text := filters->>'category';
  filter_popular boolean := (filters->>'is_popular')::boolean;
  filter_featured boolean := (filters->>'is_featured')::boolean;
  sort_by_field text := COALESCE(filters->>'sort_by', 'post_order');
  sort_order_dir text := COALESCE(filters->>'sort_order', 'asc');
  page_num int := COALESCE((filters->>'page')::int, 1);
  per_page_count int := COALESCE((filters->>'per_page')::int, 10);
  pagination_enabled boolean := COALESCE((filters->>'pagination')::boolean, true);
  offset_count int := (page_num - 1) * per_page_count;
  search_column text;
  result jsonb;
BEGIN
  tag_array := ARRAY(
    SELECT LOWER(TRIM(x))
    FROM UNNEST(STRING_TO_ARRAY(tag_list, ',')) AS x
    WHERE LENGTH(TRIM(x)) > 0
  );

  IF search_content THEN
    search_column := 'search_content';
  ELSE
    search_column := 'search_text';
  END IF;

  SELECT COALESCE(JSONB_AGG(row_to_json(t)), '[]'::jsonb) INTO result
  FROM (
    SELECT
      p.id,
      p.post_number,
      p.slug,
      p.text_hi,
      p.text_en,
      p.meaning_hi,
      p.meaning_en,
      CASE
        WHEN c.id IS NULL THEN NULL
        ELSE JSONB_BUILD_OBJECT('name', c.name, 'slug', c.slug)
      END AS category,
      p.is_popular,
      p.is_featured,
      p.created_at,
      p.updated_at,
      COALESCE(
        (SELECT JSONB_AGG(JSONB_BUILD_OBJECT('id', tg.id, 'name', tg.name, 'slug', tg.slug) ORDER BY tg.name)
         FROM public.post_tags pt
         JOIN public.tags tg ON tg.id = pt.tag_id
         WHERE pt.post_id = p.id),
        '[]'::jsonb
      ) AS tags,
      COUNT(*) OVER() AS total_count
    FROM public.posts p
    LEFT JOIN public.categories c ON c.id = p.category_id
    WHERE
      (
        NULLIF(search_query, '') IS NULL
        OR (
          CASE search_column
            WHEN 'search_content' THEN p.search_content
            WHEN 'search_text' THEN p.search_text
          END
        ILIKE '%' || search_query || '%'
        )
      )
      AND (
        COALESCE(cardinality(tag_array), 0) = 0
        OR EXISTS (
          SELECT 1
          FROM public.post_tags pt2
          INNER JOIN public.tags t2 ON t2.id = pt2.tag_id
          WHERE pt2.post_id = p.id
          AND t2.slug = ANY(tag_array)
        )
      )
      AND (filter_popular IS NOT TRUE OR p.is_popular)
      AND (filter_featured IS NOT TRUE OR p.is_featured)
      AND (NULLIF(category_slug, '') IS NULL OR c.slug = category_slug)
      AND p.post_status = 'publish'
    GROUP BY
      p.id, c.id, c.name, c.slug
    ORDER BY
      CASE WHEN sort_by_field = 'is_featured' AND sort_order_dir = 'asc' THEN p.is_featured::int END ASC,
      CASE WHEN sort_by_field = 'is_featured' AND sort_order_dir = 'desc' THEN p.is_featured::int END DESC,
      CASE WHEN sort_by_field = 'is_popular' AND sort_order_dir = 'asc' THEN p.is_popular::int END ASC,
      CASE WHEN sort_by_field = 'is_popular' AND sort_order_dir = 'desc' THEN p.is_popular::int END DESC,
      CASE WHEN sort_by_field = 'text_en' AND sort_order_dir = 'asc' THEN p.text_en END ASC,
      CASE WHEN sort_by_field = 'text_en' AND sort_order_dir = 'desc' THEN p.text_en END DESC,
      CASE WHEN sort_by_field = 'text_hi' AND sort_order_dir = 'asc' THEN p.text_hi END ASC,
      CASE WHEN sort_by_field = 'text_hi' AND sort_order_dir = 'desc' THEN p.text_hi END DESC,
      p.post_number ASC
    LIMIT CASE WHEN pagination_enabled THEN per_page_count ELSE NULL END
    OFFSET CASE WHEN pagination_enabled THEN offset_count ELSE 0 END
  ) t;

  RETURN result;
END;
$$;
