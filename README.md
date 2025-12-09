# South Flowers Portal

A Next.js 16 application for managing a cannabis social club with role-based access control, member management, and inventory tracking.

## 🚀 Quick Start

### Development Setup

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   
   # Edit .env.local with your Supabase credentials
   # See ENVIRONMENT_SETUP.md for details
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   ```
   http://localhost:3000
   ```

## 📚 Documentation

- **[Environment Setup](./ENVIRONMENT_SETUP.md)** - Configure environment variables
- **[Deployment Guide](./DEPLOYMENT.md)** - Deploy to production
- **[Production Deployment Guide](./PRODUCTION_DEPLOYMENT_GUIDE.md)** - Complete production setup
- **[Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)** - Quick reference checklist
- **[Testing Plan](./TESTING_PLAN.md)** - Testing scenarios and procedures

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: HeadlessUI
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Netlify

## 🔑 Features

### Member Portal
- Magic link authentication
- Strain catalog browsing
- Order placement (7g monthly limit)
- Order history tracking
- Profile management
- Messaging system

### Staff Portal
- Password + magic link authentication
- Member management
- Inventory management
- Order processing
- Messaging with members

### Admin Portal
- User role management
- System configuration
- Analytics and reporting

## 🛡️ Security

- Row Level Security (RLS) policies
- Role-based access control (RBAC)
- Secure authentication flows
- Environment variable protection
- HTTPS enforcement

## 🚀 Deployment

### Quick Deploy to Netlify

1. **Set Environment Variables** in Netlify Dashboard
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_key
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   ```

2. **Configure Supabase Redirect URLs**
   - Add production URL to Supabase Auth settings
   - See [Production Deployment Guide](./PRODUCTION_DEPLOYMENT_GUIDE.md)

3. **Deploy**
   ```bash
   git push origin main
   ```

See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for complete steps.

## 🧪 Testing

```bash
# Run linter
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
south-flowers-portal/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── dashboard/    # Member dashboard
│   │   ├── staff/        # Staff portal
│   │   ├── admin/        # Admin portal
│   │   ├── auth/         # Authentication pages
│   │   └── login/        # Login page
│   ├── components/       # Reusable components
│   └── lib/              # Utilities and helpers
├── public/               # Static assets
├── database/             # Database scripts
└── docs/                 # Documentation
```

## 🔐 User Roles

| Role | Access Level | Features |
|------|-------------|----------|
| **Member** | Basic | Browse strains, place orders, view history |
| **Staff** | Elevated | Member management, inventory, order processing |
| **Admin** | High | Staff management, system configuration |
| **Master Admin** | Full | Complete system access |

## 🌐 Routes

### Public Routes
- `/` - Landing page
- `/login` - Member login
- `/staff/login` - Staff login

### Protected Routes
- `/dashboard/*` - Member dashboard (requires authentication)
- `/staff/*` - Staff portal (requires staff role)
- `/admin/*` - Admin portal (requires admin role)

## 🛠️ Development

### Prerequisites
- Node.js 20+
- npm or yarn
- Supabase account

### Local Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production build locally
npm start
```

## 📝 Environment Variables

Required environment variables (see `.env.example`):

```bash
NEXT_PUBLIC_SUPABASE_URL=          # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Supabase anonymous key
SUPABASE_SERVICE_ROLE_KEY=         # Supabase service role key
NEXT_PUBLIC_SITE_URL=              # Production domain URL
```

## 🐛 Troubleshooting

### Common Issues

**Magic links redirect to localhost**
- Ensure `NEXT_PUBLIC_SITE_URL` is set in production
- Configure Supabase redirect URLs
- See [Production Deployment Guide](./PRODUCTION_DEPLOYMENT_GUIDE.md)

**Auth callback stuck**
- Check Supabase redirect URLs are configured
- Verify environment variables are set
- Check browser console for errors

**Build failures**
- Run `npm run lint` to check for errors
- Verify all dependencies are installed
- Check Node.js version (20+ required)

## 📞 Support

For issues and questions:
1. Check [PRODUCTION_DEPLOYMENT_GUIDE.md](./PRODUCTION_DEPLOYMENT_GUIDE.md)
2. Review [TESTING_PLAN.md](./TESTING_PLAN.md)
3. Check browser console for errors
4. Review Netlify build logs

## 📄 License

Private - South Flowers Social Club

---

**Production URL**: https://south-flowers-portal.netlify.app
**Built with**: Next.js 16 + Supabase + Tailwind CSS v4