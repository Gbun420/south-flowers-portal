-- SQL to be executed in Supabase SQL Editor

-- Create Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  to_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject TEXT,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS messages_from_id_idx ON messages(from_id);
CREATE INDEX IF NOT EXISTS messages_to_id_idx ON messages(to_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages(created_at);

-- Optional: Enable Row Level Security (RLS) for the messages table
-- ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Optional: Create RLS Policies (example - adjust as needed for your application's logic)
-- Policy to allow users to view messages where they are the sender or recipient
-- CREATE POLICY "Users can view their own messages"
-- ON messages FOR SELECT
-- USING (auth.uid() = from_id OR auth.uid() = to_id);

-- Policy to allow users to send messages
-- CREATE POLICY "Users can send messages"
-- ON messages FOR INSERT
-- WITH CHECK (auth.uid() = from_id);

-- Policy to allow users to update their own sent messages (e.g., mark as read)
-- CREATE POLICY "Users can update their own messages"
-- ON messages FOR UPDATE
-- USING (auth.uid() = from_id OR auth.uid() = to_id);
-- WITH CHECK (auth.uid() = from_id OR auth.uid() = to_id);

-- Policy to allow users to delete their own messages (optional)
-- CREATE POLICY "Users can delete their own messages"
-- ON messages FOR DELETE
-- USING (auth.uid() = from_id OR auth.uid() = to_id);
