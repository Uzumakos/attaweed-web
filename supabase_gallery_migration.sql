-- ============================================================================
-- Gallery Albums: multiple photos per theme
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Drop the old single-photo table if it exists (it was just created, no data)
DROP TABLE IF EXISTS gallery_photos;

-- Albums / Themes table
CREATE TABLE IF NOT EXISTS gallery_albums (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Autre',
  visible BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Individual photos within an album
CREATE TABLE IF NOT EXISTS gallery_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  album_id UUID NOT NULL REFERENCES gallery_albums(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;

-- Public read for visible albums
CREATE POLICY "Public can view visible albums"
  ON gallery_albums FOR SELECT
  USING (visible = true);

-- Authenticated can manage albums
CREATE POLICY "Authenticated users can manage albums"
  ON gallery_albums FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Public read for photos in visible albums
CREATE POLICY "Public can view photos in visible albums"
  ON gallery_photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM gallery_albums WHERE id = album_id AND visible = true
    )
  );

-- Authenticated can manage photos
CREATE POLICY "Authenticated users can manage photos"
  ON gallery_photos FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_gallery_albums_order ON gallery_albums(display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_albums_visible ON gallery_albums(visible);
CREATE INDEX IF NOT EXISTS idx_gallery_photos_album ON gallery_photos(album_id);
CREATE INDEX IF NOT EXISTS idx_gallery_photos_order ON gallery_photos(display_order);
