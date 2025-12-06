# South Flowers CHRA - Setup Instructions

## Prerequisites
- Node.js 18+ installed
- Supabase account and project created
- Git (optional)

## 1. Environment Setup

### Create `.env.local` file
Create a file named `.env.local` in the root directory with your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these values from your Supabase project dashboard:
1. Go to [supabase.com](https://supabase.com)
2. Select your project
3. Go to Settings → API
4. Copy the Project URL and Anon Key

## 2. Database Setup

### Option A: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the sidebar
3. Click "New query"
4. Copy the entire contents of `database/schema.sql`
5. Paste it into the SQL editor
6. Click "Run" to execute the schema

### Option B: Using Supabase CLI
If you have the Supabase CLI installed:
```bash
supabase db push
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 5. Test Authentication

### Member Login (Magic Link)
1. Go to `http://localhost:3000/login`
2. Enter your email (e.g., `bundyglenn@gmail.com`)
3. Click "Send Magic Link"
4. Check your email for the magic link
5. Click the link to complete login

### Staff Login
1. Toggle to "Staff Login" on the login page
2. Enter staff email and password
3. Click "Sign In"

## Database Schema

The app uses the following main tables:

### `profiles`
- `id` (UUID) - Primary key, references auth.users
- `email` (TEXT) - User email
- `role` (TEXT) - 'member', 'staff', or 'admin'
- `full_name` (TEXT) - User's full name
- `membership_expiry` (TIMESTAMP) - Membership expiration date
- `monthly_limit_remaining` (INTEGER) - Remaining monthly order limit
- `residence_id_number` (TEXT) - Residence ID number
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp

### `strains`
- `id` (UUID) - Primary key
- `name` (TEXT) - Strain name
- `type` (TEXT) - 'indica', 'sativa', or 'hybrid'
- `thc_percent` (DECIMAL) - THC percentage
- `description` (TEXT) - Strain description
- `is_visible` (BOOLEAN) - Whether strain is visible to members

### `orders`
- `id` (UUID) - Primary key
- `user_id` (UUID) - References profiles.id
- `strain_id` (UUID) - References strains.id
- `quantity_grams` (DECIMAL) - Order quantity in grams
- `status` (TEXT) - Order status
- `total_price` (DECIMAL) - Order total price
- `notes` (TEXT) - Order notes

### `messages`
- `id` (UUID) - Primary key
- `sender_id` (UUID) - References profiles.id
- `recipient_id` (UUID) - References profiles.id (nullable)
- `content` (TEXT) - Message content
- `is_read` (BOOLEAN) - Read status

## Troubleshooting

### "Database error saving new user"
This usually means the database schema is not set up correctly:
1. Ensure you've run the SQL schema in Supabase
2. Check that the `profiles` table exists
3. Verify the table has all required columns

### "Database schema is missing"
The profiles table doesn't exist or has incorrect structure:
1. Run the SQL schema from `database/schema.sql`
2. Check the Supabase logs for specific error details

### Supabase Connection Errors
1. Verify your `.env.local` file has correct credentials
2. Check that your Supabase project is active
3. Ensure the anon key has proper permissions

### Magic Link Not Working
1. Check your email spam folder
2. Verify the redirect URL in Supabase settings includes `http://localhost:3000/auth/callback`
3. Check the server console for error messages

## Development Notes

- The app uses Next.js 14 with App Router
- Authentication is handled by Supabase Auth
- Row Level Security (RLS) is enabled on all tables
- The app automatically creates user profiles on first login
- All database operations include proper error handling

## Support

If you encounter issues:
1. Check the browser console (F12) for JavaScript errors
2. Check the terminal where the server is running for server errors
3. Verify the Supabase logs in your project dashboard
4. Ensure all environment variables are set correctly
