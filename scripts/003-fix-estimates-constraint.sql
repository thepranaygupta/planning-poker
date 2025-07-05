-- Drop the existing unique constraint that's causing issues
ALTER TABLE estimates DROP CONSTRAINT IF EXISTS estimates_session_id_user_name_key;

-- Add a new unique constraint that allows updates
ALTER TABLE estimates ADD CONSTRAINT estimates_session_id_user_name_unique 
  UNIQUE (session_id, user_name);

-- Ensure the table has proper conflict resolution
-- The upsert should work with this constraint
