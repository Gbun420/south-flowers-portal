# Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Optional: Custom Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

## Getting Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to Settings → API
4. Copy the Project URL and anon key
5. For server-side operations, use the service_role_key (keep this secret)

## Development vs Production

### Development
- Use `.env.local` for local development
- Variables are automatically loaded by Next.js

### Production
- Set environment variables in your hosting platform
- Netlify: Site Settings → Build & Deploy → Environment
- Docker: Pass environment variables during deployment

## Security Notes

- Never commit `.env.local` to version control
- The service_role_key should only be used on the server
- Use different Supabase projects for development and production
- Regularly rotate your API keys

## Required Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public API key for client-side |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-side API key |

## Optional Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Your application URL |
| `NODE_ENV` | `development` | Environment mode |
