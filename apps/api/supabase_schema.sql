-- Create the History Table
CREATE TABLE IF NOT EXISTS public.ugc_history (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT NOT NULL,
    prompt_used TEXT,
    photo_url TEXT,
    video_url TEXT,
    market_research JSONB,
    analytics JSONB
);

-- Enable Row Level Security (optional, but good practice)
ALTER TABLE public.ugc_history ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all reads (for demo purposes)
CREATE POLICY "Allow public read access" ON public.ugc_history FOR SELECT USING (true);

-- Create policy to allow all inserts (for demo purposes)
CREATE POLICY "Allow public insert access" ON public.ugc_history FOR INSERT WITH CHECK (true);

-- Create policy to allow all updates (for demo purposes)
CREATE POLICY "Allow public update access" ON public.ugc_history FOR UPDATE USING (true);

-- Reload PostgREST schema cache so the API immediately recognizes the new table
NOTIFY pgrst, 'reload schema';
