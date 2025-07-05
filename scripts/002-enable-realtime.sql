-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE session_users;
ALTER PUBLICATION supabase_realtime ADD TABLE estimates;

-- Ensure Row Level Security policies allow realtime
-- (The policies we created earlier should work, but let's make sure)

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all operations on sessions" ON sessions;
DROP POLICY IF EXISTS "Allow all operations on session_users" ON session_users;
DROP POLICY IF EXISTS "Allow all operations on estimates" ON estimates;

-- Create new policies that explicitly allow realtime
CREATE POLICY "Enable all operations for sessions" ON sessions
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for session_users" ON session_users
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for estimates" ON estimates
  FOR ALL USING (true) WITH CHECK (true);

-- Enable realtime on the tables
ALTER TABLE sessions REPLICA IDENTITY FULL;
ALTER TABLE session_users REPLICA IDENTITY FULL;
ALTER TABLE estimates REPLICA IDENTITY FULL;
