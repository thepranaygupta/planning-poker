-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  creator_name VARCHAR(255) NOT NULL,
  sizing_type VARCHAR(50) DEFAULT 'short_fibonacci',
  allow_members_manage BOOLEAN DEFAULT false,
  cards_revealed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create session_users table
CREATE TABLE IF NOT EXISTS session_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  is_creator BOOLEAN DEFAULT false,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, name)
);

-- Create estimates table
CREATE TABLE IF NOT EXISTS estimates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  user_name VARCHAR(255) NOT NULL,
  estimate VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, user_name)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_session_users_session_id ON session_users(session_id);
CREATE INDEX IF NOT EXISTS idx_estimates_session_id ON estimates(session_id);

-- Enable Row Level Security
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (since we don't have authentication)
CREATE POLICY "Allow all operations on sessions" ON sessions FOR ALL USING (true);
CREATE POLICY "Allow all operations on session_users" ON session_users FOR ALL USING (true);
CREATE POLICY "Allow all operations on estimates" ON estimates FOR ALL USING (true);
