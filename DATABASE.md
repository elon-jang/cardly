# Database Migration Guide

This document provides comprehensive guidance for database setup, migration, and schema management for the Cardly application.

## Table of Contents
- [Initial Setup](#initial-setup)
- [Database Schema](#database-schema)
- [Migration Order](#migration-order)
- [RLS (Row Level Security)](#rls-row-level-security)
- [Common Migration Tasks](#common-migration-tasks)
- [Rollback Procedures](#rollback-procedures)
- [Best Practices](#best-practices)

---

## Initial Setup

### Prerequisites
- Supabase project created
- Supabase CLI installed (optional, for local development)
- Admin access to Supabase SQL Editor

### Environment Variables
Ensure these are set in your `.env` file:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Database Schema

The application uses three main tables:

### 1. user_profiles
Stores user profile information that auto-fills card data.

**Columns:**
- `id` (UUID): Primary key
- `user_id` (UUID): Foreign key to `auth.users`, UNIQUE
- `name` (TEXT): User's full name
- `title` (TEXT): Job title or professional title
- `phone` (TEXT): Contact phone number
- `email` (TEXT): Contact email
- `instagram` (TEXT): Instagram handle
- `blog` (TEXT): Blog or website URL
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

**Constraints:**
- One profile per user (`user_id` is UNIQUE)
- Cascading delete when user is deleted

### 2. business_cards
Stores saved business card designs.

**Columns:**
- `id` (UUID): Primary key
- `user_id` (UUID): Foreign key to `auth.users`
- `name` (TEXT): Name on card (required)
- `title` (TEXT): Job title on card
- `phone` (TEXT): Phone number on card
- `email` (TEXT): Email on card
- `instagram` (TEXT): Instagram handle on card
- `blog` (TEXT): Blog URL on card
- `image` (TEXT): Image URL or data
- `theme` (TEXT): Theme name (required)
- `layout` (TEXT): Layout name (required)
- `image_gradient` (BOOLEAN): Whether gradient overlay is applied
- `created_at` (TIMESTAMP): Creation timestamp
- `updated_at` (TIMESTAMP): Last update timestamp

**Indexes:**
- `business_cards_user_id_idx`: Fast user card lookups
- `business_cards_created_at_idx`: Sorted retrieval (DESC)

### 3. custom_images
Stores user-uploaded images as base64 data.

**Columns:**
- `id` (UUID): Primary key
- `user_id` (UUID): Foreign key to `auth.users`
- `image_data` (TEXT): Base64-encoded image (required)
- `created_at` (TIMESTAMP): Upload timestamp

**Indexes:**
- `custom_images_user_id_idx`: Fast user image lookups

---

## Migration Order

**IMPORTANT:** Execute SQL files in this exact order to avoid foreign key errors:

1. **create_business_cards_table.sql**
   - Creates `business_cards` table
   - Creates `update_updated_at_column()` function (used by other tables)
   - Sets up RLS policies
   - Creates indexes

2. **create_user_profiles_table.sql**
   - Creates `user_profiles` table
   - Uses `update_updated_at_column()` from step 1
   - Sets up RLS policies

3. **create_custom_images_table.sql**
   - Creates `custom_images` table
   - Sets up RLS policies

### Execution via Supabase Dashboard

1. Navigate to your Supabase project
2. Go to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy contents of SQL file
5. Click **Run** or press `Ctrl+Enter`
6. Verify success message appears
7. Repeat for each file in order

### Execution via Supabase CLI (Local Development)

```bash
# Run migrations in order
supabase db push --file create_business_cards_table.sql
supabase db push --file create_user_profiles_table.sql
supabase db push --file create_custom_images_table.sql
```

---

## RLS (Row Level Security)

All tables enforce Row Level Security to ensure users can only access their own data.

### Policy Pattern

Every table follows this pattern:
```sql
-- Enable RLS
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can view their own data
CREATE POLICY "Users can view their own {resource}"
  ON table_name FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Users can create their own data
CREATE POLICY "Users can create their own {resource}"
  ON table_name FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can update their own data
CREATE POLICY "Users can update their own {resource}"
  ON table_name FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can delete their own data
CREATE POLICY "Users can delete their own {resource}"
  ON table_name FOR DELETE
  USING (auth.uid() = user_id);
```

### Testing RLS Policies

```sql
-- Test as authenticated user
SELECT * FROM business_cards; -- Should only return current user's cards
SELECT * FROM user_profiles;  -- Should only return current user's profile

-- Attempt to access another user's data (should fail)
SELECT * FROM business_cards WHERE user_id = 'other-user-uuid';
```

---

## Common Migration Tasks

### Adding a Column

```sql
-- Example: Add 'company' field to business_cards
ALTER TABLE business_cards
ADD COLUMN company TEXT;

-- Add with default value
ALTER TABLE business_cards
ADD COLUMN is_featured BOOLEAN DEFAULT false;
```

### Modifying a Column

```sql
-- Change column type
ALTER TABLE business_cards
ALTER COLUMN phone TYPE VARCHAR(20);

-- Make column required
ALTER TABLE business_cards
ALTER COLUMN email SET NOT NULL;

-- Make column optional
ALTER TABLE business_cards
ALTER COLUMN title DROP NOT NULL;
```

### Renaming a Column

```sql
ALTER TABLE business_cards
RENAME COLUMN blog TO website;
```

### Dropping a Column

```sql
ALTER TABLE business_cards
DROP COLUMN instagram;
```

### Adding an Index

```sql
-- Simple index
CREATE INDEX business_cards_email_idx ON business_cards(email);

-- Composite index
CREATE INDEX business_cards_user_theme_idx ON business_cards(user_id, theme);

-- Partial index (only index non-null values)
CREATE INDEX business_cards_email_idx ON business_cards(email)
WHERE email IS NOT NULL;
```

### Creating a New Table

```sql
-- Example: Add analytics tracking
CREATE TABLE IF NOT EXISTS card_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  card_id UUID NOT NULL REFERENCES business_cards(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX card_views_card_id_idx ON card_views(card_id);

-- Enable RLS
ALTER TABLE card_views ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view analytics for their own cards
CREATE POLICY "Users can view their card analytics"
  ON card_views FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM business_cards
      WHERE business_cards.id = card_views.card_id
        AND business_cards.user_id = auth.uid()
    )
  );
```

---

## Rollback Procedures

### Dropping Tables (Reverse Migration)

**WARNING:** This deletes all data. Use with extreme caution.

```sql
-- Drop tables in reverse order (opposite of creation)
DROP TABLE IF EXISTS custom_images CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS business_cards CASCADE;

-- Drop shared function if no longer needed
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
```

### Removing Columns

```sql
-- Remove column
ALTER TABLE business_cards
DROP COLUMN IF EXISTS company;
```

### Disabling RLS (Not Recommended)

```sql
-- Disable RLS on a table
ALTER TABLE business_cards DISABLE ROW LEVEL SECURITY;
```

### Backup Before Major Changes

```bash
# Using Supabase CLI
supabase db dump -f backup.sql

# Or via pg_dump
pg_dump postgresql://[CONNECTION_STRING] > backup.sql
```

---

## Best Practices

### 1. Always Use Migrations for Schema Changes
Never manually alter production schemas. Use versioned SQL migration files.

```
migrations/
  001_initial_schema.sql
  002_add_company_field.sql
  003_add_card_analytics.sql
```

### 2. Test in Staging First
- Create a staging Supabase project
- Run migrations there first
- Test application functionality
- Then apply to production

### 3. Use Transactions for Complex Migrations

```sql
BEGIN;

-- Multiple operations
ALTER TABLE business_cards ADD COLUMN company TEXT;
UPDATE business_cards SET company = 'Unknown' WHERE company IS NULL;
ALTER TABLE business_cards ALTER COLUMN company SET NOT NULL;

-- Verify changes
SELECT COUNT(*) FROM business_cards WHERE company IS NULL;
-- Should return 0

COMMIT;  -- or ROLLBACK if something went wrong
```

### 4. Maintain updated_at Timestamps

When creating new tables, always include:
```sql
updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL

CREATE TRIGGER update_table_name_updated_at
  BEFORE UPDATE ON table_name
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 5. Document Every Migration

Add comments to SQL files:
```sql
-- Migration: Add company field to business cards
-- Date: 2025-01-15
-- Author: Team
-- Reason: Support multi-company use case
ALTER TABLE business_cards ADD COLUMN company TEXT;
```

### 6. Handle Null Values Explicitly

```sql
-- Bad: Assumes data exists
ALTER TABLE business_cards ALTER COLUMN email SET NOT NULL;

-- Good: Clean data first
UPDATE business_cards SET email = '' WHERE email IS NULL;
ALTER TABLE business_cards ALTER COLUMN email SET NOT NULL;
```

### 7. Use IF NOT EXISTS / IF EXISTS

Prevents errors when running migrations multiple times:
```sql
CREATE TABLE IF NOT EXISTS new_table (...);
CREATE INDEX IF NOT EXISTS new_index ON table(column);
DROP TABLE IF EXISTS old_table;
```

### 8. Monitor Performance After Index Changes

```sql
-- Check index usage
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- Find unused indexes
SELECT
  schemaname,
  tablename,
  indexname
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND schemaname = 'public';
```

### 9. Cascade Deletes Appropriately

All foreign keys use `ON DELETE CASCADE` to ensure:
- When a user is deleted, all their cards, profiles, and images are deleted
- No orphaned records remain in the database

```sql
user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
```

### 10. Regular Backups

Set up automated backups:
- Supabase Pro: Automatic daily backups (7-day retention)
- Self-hosted: Configure `pg_dump` cron jobs
- Before major migrations: Manual backup

---

## Troubleshooting

### Common Errors

**Error: `function update_updated_at_column() does not exist`**
- **Cause:** Running user_profiles migration before business_cards
- **Fix:** Run `create_business_cards_table.sql` first

**Error: `policy already exists`**
- **Cause:** Re-running migration without dropping policies first
- **Fix:** Add `DROP POLICY IF EXISTS` before creating policies

**Error: `permission denied for table`**
- **Cause:** RLS is blocking access
- **Fix:** Verify you're authenticated and policies are correct

**Error: `violates foreign key constraint`**
- **Cause:** Trying to insert with invalid `user_id`
- **Fix:** Ensure user exists in `auth.users` table

### Verifying Migration Success

```sql
-- Check table exists
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('business_cards', 'user_profiles', 'custom_images');

-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Check policies exist
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public';

-- Check indexes exist
SELECT indexname, tablename
FROM pg_indexes
WHERE schemaname = 'public';
```

---

## Additional Resources

- [Supabase SQL Editor](https://supabase.com/docs/guides/database)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [RLS Best Practices](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI](https://supabase.com/docs/reference/cli)

---

**Last Updated:** 2025-01-25
