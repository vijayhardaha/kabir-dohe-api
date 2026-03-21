-- Enable RLS on all tables

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;

-- RLS policies for public read access

CREATE POLICY "Public Read Posts" ON public.posts FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Public Read Tags" ON public.tags FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT TO anon USING (TRUE);
CREATE POLICY "Public Read Post_Tags" ON public.post_tags FOR SELECT TO anon USING (TRUE);
