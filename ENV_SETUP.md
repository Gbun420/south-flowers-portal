# Environment Variables Setup

## Local Development

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update the values in `.env.local` with your actual credentials

3. **Never commit `.env.local` to Git** (it's already in .gitignore)

## Vercel Deployment

### Step 1: Go to Vercel Dashboard
- Navigate to your project in Vercel
- Go to **Settings** → **Environment Variables**

### Step 2: Add Environment Variables

Add these variables in Vercel:

**Required:**
- `DATABASE_URL` - Your production database connection string
- `NEXTAUTH_SECRET` - Generate a random secret: `openssl rand -base64 32`
- `NEXTAUTH_URL` - Your Vercel domain (e.g., `https://your-app.vercel.app`)

**Optional (if using these services):**
- `STRIPE_PUBLISHABLE_KEY` - Your Stripe public key
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `RESEND_API_KEY` - For email notifications
- `FROM_EMAIL` - Default sender email
- `FLOWER_API_KEY` - If using external flower supplier API

**Environment:**
- `NODE_ENV` - Set to `production`

### Step 3: Redeploy
- After adding variables, click **Redeploy** or push a new commit

## Security Notes

- Use different values for development and production
- Generate strong secrets for authentication
- Never expose secret keys in client-side code
- Only use `NEXT_PUBLIC_` prefix for variables that must be accessible in the browser

## Testing

After deployment, test that your environment variables are working:
- Check database connectivity
- Test authentication flows
- Verify any third-party integrations