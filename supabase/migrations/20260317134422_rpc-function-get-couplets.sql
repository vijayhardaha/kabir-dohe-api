-- Optimized RPC function for fetching couplets/posts.
-- Replaces multiple SQL queries with a single function call for better performance.

-- Drop existing function if exists
DROP FUNCTION IF EXISTS get_couplets(jsonb);

-- Create the optimized function
CREATE OR REPLACE FUNCTION get_couplets(filters jsonb)
RETURNS TABLE (
  id uuid,
  post_number integer,
  post_order integer,
  slug text,
  text_hi text,
  text_en text,
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
  category_id uuid,
  category_name text,
  category_slug text,
  is_popular boolean,
  is_featured boolean,
  created_at timestamptz,
  updated_at timestamptz,
  tags jsonb,
  total_count bigint
) AS $$
DECLARE
  search_text text := filters->>'search';
  search_content boolean := COALESCE((filters->>'search_content')::boolean, false);
  tag_list text := COALESCE(filters->>'tags', '');
  tag_array text[];
  category_slug_filter text := filters->>'category';
  is_popular_filter boolean := (filters->>'is_popular')::boolean;
  is_featured_filter boolean := (filters->>'is_featured')::boolean;
  sort_by_field text := COALESCE(filters->>'sort_by', 'post_order');
  sort_order_dir text := COALESCE(filters->>'sort_order', 'asc');
  page_num int := COALESCE((filters->>'page')::int, 1);
  per_page_count int := COALESCE((filters->>'per_page')::int, 10);
  pagination_enabled boolean := COALESCE((filters->>'pagination')::boolean, true);

  offset_count int := (page_num - 1) * per_page_count;
  search_fields text[];
BEGIN
  -- Convert comma-separated tags to array
  tag_array := ARRAY(
    SELECT LOWER(TRIM(x))
    FROM UNNEST(STRING_TO_ARRAY(tag_list, ',')) AS x
    WHERE LENGTH(TRIM(x)) > 0
  );

  -- Determine which fields to search based on search_content parameter
  IF search_content THEN
    search_fields := ARRAY['search_content_hi', 'search_content_en'];
  ELSE
    search_fields := ARRAY['text_hi', 'text_en'];
  END IF;

  RETURN QUERY
  WITH filtered_posts AS (
    SELECT
      p.id,
      p.post_number,
      p.post_order,
      p.slug,
      p.text_hi,
      p.text_en,
      p.interpretation_hi,
      p.interpretation_en,
      p.philosophical_analysis_hi,
      p.philosophical_analysis_en,
      p.practical_example_hi,
      p.practical_example_en,
      p.practice_guidance_hi,
      p.practice_guidance_en,
      p.core_message_hi,
      p.core_message_en,
      p.reflection_questions_hi,
      p.reflection_questions_en,
      p.category_id,
      c.name AS category_name,
      c.slug AS category_slug,
      p.is_popular,
      p.is_featured,
      p.created_at,
      p.updated_at,
      COUNT(*) OVER() AS total_count
    FROM posts p
    LEFT JOIN categories c ON c.id = p.category_id
    LEFT JOIN post_tags pt ON pt.post_id = p.id
    LEFT JOIN tags t ON t.id = pt.tag_id
    WHERE
      -- Search filter
      (
        search_text IS NULL
        OR search_text = ''
        OR (
          SELECT COUNT(*) FROM unnest(search_fields) AS sf
          WHERE sf = 'search_content_hi' AND p.search_content_hi ILIKE '%' || search_text || '%'
        ) > 0
        OR (
          SELECT COUNT(*) FROM unnest(search_fields) AS sf
          WHERE sf = 'search_content_en' AND p.search_content_en ILIKE '%' || search_text || '%'
        ) > 0
        OR (
          SELECT COUNT(*) FROM unnest(search_fields) AS sf
          WHERE sf = 'text_hi' AND p.text_hi ILIKE '%' || search_text || '%'
        ) > 0
        OR (
          SELECT COUNT(*) FROM unnest(search_fields) AS sf
          WHERE sf = 'text_en' AND p.text_en ILIKE '%' || search_text || '%'
        ) > 0
      )

      -- Tag filter
      AND (
        tag_array IS NULL
        OR array_length(tag_array, 1) IS NULL
        OR array_length(tag_array, 1) = 0
        OR EXISTS (
          SELECT 1 FROM post_tags pt2
          JOIN tags t2 ON t2.id = pt2.tag_id
          WHERE pt2.post_id = p.id
          AND LOWER(t2.slug) = ANY(tag_array)
        )
      )

      -- Popular filter
      AND (
        is_popular_filter IS NULL
        OR is_popular_filter IS FALSE
        OR p.is_popular = is_popular_filter
      )

      -- Featured filter
      AND (
        is_featured_filter IS NULL
        OR is_featured_filter IS FALSE
        OR p.is_featured = is_featured_filter
      )

      -- Category filter
      AND (
        category_slug_filter IS NULL
        OR category_slug_filter = ''
        OR c.slug = category_slug_filter
      )

    GROUP BY
      p.id, c.name, c.slug
  ),
  post_tags_json AS (
    SELECT
      pt.post_id,
      JSONB_AGG(
        JSONB_BUILD_OBJECT(
          'id', t.id,
          'name', t.name,
          'slug', t.slug
        ) ORDER BY t.name
      ) FILTER (WHERE t.id IS NOT NULL) AS tags
    FROM post_tags pt
    LEFT JOIN tags t ON t.id = pt.tag_id
    GROUP BY pt.post_id
  )
  SELECT
    fp.id,
    fp.post_number,
    fp.post_order,
    fp.slug,
    fp.text_hi,
    fp.text_en,
    fp.interpretation_hi,
    fp.interpretation_en,
    fp.philosophical_analysis_hi,
    fp.philosophical_analysis_en,
    fp.practical_example_hi,
    fp.practical_example_en,
    fp.practice_guidance_hi,
    fp.practice_guidance_en,
    fp.core_message_hi,
    fp.core_message_en,
    fp.reflection_questions_hi,
    fp.reflection_questions_en,
    fp.category_id,
    fp.category_name,
    fp.category_slug,
    fp.is_popular,
    fp.is_featured,
    fp.created_at,
    fp.updated_at,
    COALESCE(ptj.tags, '[]'::jsonb) AS tags,
    fp.total_count
  FROM filtered_posts fp
  LEFT JOIN post_tags_json ptj ON ptj.post_id = fp.id
  ORDER BY
    CASE WHEN sort_by_field = 'is_featured' AND sort_order_dir = 'asc' THEN fp.is_featured::int END ASC,
    CASE WHEN sort_by_field = 'is_featured' AND sort_order_dir = 'desc' THEN fp.is_featured::int END DESC,
    CASE WHEN sort_by_field = 'is_popular' AND sort_order_dir = 'asc' THEN fp.is_popular::int END ASC,
    CASE WHEN sort_by_field = 'is_popular' AND sort_order_dir = 'desc' THEN fp.is_popular::int END DESC,
    CASE WHEN sort_by_field = 'text_en' AND sort_order_dir = 'asc' THEN fp.text_en END ASC,
    CASE WHEN sort_by_field = 'text_en' AND sort_order_dir = 'desc' THEN fp.text_en END DESC,
    CASE WHEN sort_by_field = 'text_hi' AND sort_order_dir = 'asc' THEN fp.text_hi END ASC,
    CASE WHEN sort_by_field = 'text_hi' AND sort_order_dir = 'desc' THEN fp.text_hi END DESC,
    CASE WHEN sort_by_field = 'id' OR sort_by_field = 'post_order' OR sort_by_field IS NULL THEN fp.post_order END ASC,
    fp.post_order ASC
  LIMIT CASE WHEN pagination_enabled THEN per_page_count ELSE NULL END
  OFFSET CASE WHEN pagination_enabled THEN offset_count ELSE 0 END;
END;
$$ LANGUAGE plpgsql;
