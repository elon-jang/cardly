-- custom_images 테이블 생성
CREATE TABLE IF NOT EXISTS custom_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_data TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- user_id로 검색을 위한 인덱스 생성
CREATE INDEX IF NOT EXISTS custom_images_user_id_idx ON custom_images(user_id);

-- RLS (Row Level Security) 활성화
ALTER TABLE custom_images ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 커스텀 이미지만 조회 가능
CREATE POLICY "Users can view their own custom images"
  ON custom_images
  FOR SELECT
  USING (auth.uid() = user_id);

-- 사용자는 자신의 커스텀 이미지만 생성 가능
CREATE POLICY "Users can create their own custom images"
  ON custom_images
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 커스텀 이미지만 삭제 가능
CREATE POLICY "Users can delete their own custom images"
  ON custom_images
  FOR DELETE
  USING (auth.uid() = user_id);
