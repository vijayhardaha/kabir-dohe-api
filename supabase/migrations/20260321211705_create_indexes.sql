-- Create indexes for filtering, sorting, and trigram search

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
CREATE INDEX idx_posts_search_text ON public.posts USING GIN (search_text extensions.gin_trgm_ops);
CREATE INDEX idx_posts_search_content ON public.posts USING GIN (search_content extensions.gin_trgm_ops);
