-- business_cards 테이블 생성
CREATE TABLE IF NOT EXISTS business_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT,
  phone TEXT,
  email TEXT,
  instagram TEXT,
  blog TEXT,
  image TEXT,
  theme TEXT NOT NULL,
  layout TEXT NOT NULL,
  image_gradient BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- user_id로 검색을 위한 인덱스 생성
CREATE INDEX IF NOT EXISTS business_cards_user_id_idx ON business_cards(user_id);

-- created_at으로 정렬을 위한 인덱스 생성
CREATE INDEX IF NOT EXISTS business_cards_created_at_idx ON business_cards(created_at DESC);

-- RLS (Row Level Security) 활성화
ALTER TABLE business_cards ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 카드만 조회 가능
CREATE POLICY "Users can view their own cards"
  ON business_cards
  FOR SELECT
  USING (auth.uid() = user_id);

-- 사용자는 자신의 카드만 생성 가능
CREATE POLICY "Users can create their own cards"
  ON business_cards
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 카드만 수정 가능
CREATE POLICY "Users can update their own cards"
  ON business_cards
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 카드만 삭제 가능
CREATE POLICY "Users can delete their own cards"
  ON business_cards
  FOR DELETE
  USING (auth.uid() = user_id);

-- updated_at 자동 업데이트를 위한 함수 및 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_business_cards_updated_at
  BEFORE UPDATE ON business_cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
