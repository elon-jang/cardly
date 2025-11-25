# Cardly Setup Guide

Complete setup instructions for running Cardly locally or deploying to production.

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18 or higher
- npm or yarn package manager
- A Supabase account ([sign up free](https://supabase.com))
- Git (for cloning the repository)

## 🚀 Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/elon-jang/cardly.git
cd cardly
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React 19
- Vite
- Supabase client
- html-to-image, jsPDF (for exports)
- Lucide React (icons)

### 3. Set Up Supabase

#### Create a Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in your project details:
   - Name: `cardly` (or your preferred name)
   - Database Password: Choose a strong password
   - Region: Select closest to you
4. Wait for the project to be created (~2 minutes)

#### Get Your Supabase Credentials

1. In your Supabase project dashboard
2. Go to Settings → API
3. Copy:
   - **Project URL** (under "Project API keys")
   - **anon/public key** (under "Project API keys")

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important Notes:**
- Replace `your-project-id` and `your-anon-key-here` with your actual credentials
- Variable names **must** start with `VITE_` for Vite to load them
- Never commit the `.env` file to Git (it's in `.gitignore`)

### 5. Set Up Database Tables

Run the SQL scripts in your Supabase dashboard:

1. Go to SQL Editor in your Supabase dashboard
2. Click "New Query"
3. Copy and paste each SQL file content in order:

#### a. Create business_cards table
```sql
-- Copy content from create_business_cards_table.sql
```

#### b. Create user_profiles table
```sql
-- Copy content from create_user_profiles_table.sql
```

#### c. Create custom_images table
```sql
-- Copy content from create_custom_images_table.sql
```

4. Click "Run" for each query
5. Verify tables appear in Table Editor

### 6. Configure Authentication (Optional)

For easier development, you can disable email confirmation:

1. Go to Authentication → Providers
2. Click on "Email" provider
3. Toggle off "Confirm email"
4. Save changes

**Note:** For production, keep email confirmation enabled for security.

### 7. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

**After starting:**
- Open the URL in your browser
- You should see the Cardly login page
- Try signing up with a test email

## 🔧 Troubleshooting

### "Failed to fetch" Error

**Symptoms:** Cannot sign up or login, console shows network errors

**Solutions:**

1. **Check Environment Variables**
   ```bash
   # Restart dev server after changing .env
   npm run dev
   ```

2. **Verify Supabase Credentials**
   - Open browser console (F12)
   - Look for these logs:
     ```
     Supabase URL: https://...
     Supabase Key exists: true
     ```

3. **Check Supabase Project Status**
   - Project must be "Active" in dashboard
   - No paused or suspended status

4. **Browser Console Errors**
   - Check Network tab for failed requests
   - Look for CORS errors
   - Check for typos in credentials

### Database Connection Issues

**RLS Policies Not Working**

If you can't save cards or see your data:
- Verify all RLS policies were created
- Check user is authenticated (check browser console)
- Try re-running SQL scripts

**Tables Not Visible**

- Make sure you're in the correct Supabase project
- Refresh the Table Editor page
- Check SQL query ran without errors

### Development Server Issues

**Port Already in Use**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill
npm run dev
```

**Module Not Found Errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🌐 Deployment to Vercel

### Prerequisites
- Vercel account ([sign up free](https://vercel.com))
- GitHub repository with your code

### Deploy Steps

1. **Push to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy with Vercel CLI**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

   Or use the Vercel Dashboard:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure project settings
   - Click "Deploy"

3. **Set Environment Variables in Vercel**
   - Go to Project Settings → Environment Variables
   - Add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Save and redeploy

### Post-Deployment

1. **Test Production URL**
   - Sign up with a test account
   - Create and save a card
   - Test all features

2. **Configure Custom Domain** (optional)
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS setup instructions

3. **Update Supabase Redirect URLs**
   - Go to Supabase Authentication settings
   - Add production URL to allowed redirect URLs
   - Format: `https://your-domain.vercel.app`

## 🔐 Security Best Practices

### Environment Variables
- Never commit `.env` file
- Use different keys for development/production
- Rotate keys periodically

### Supabase Security
- Keep RLS policies enabled
- Use service role key only server-side
- Review authentication settings

### Production Checklist
- [ ] Email confirmation enabled
- [ ] RLS policies active on all tables
- [ ] Environment variables set in Vercel
- [ ] Redirect URLs configured
- [ ] Test all features in production
- [ ] Monitor Supabase usage

## 📊 Monitoring

### Supabase Dashboard
- Track API usage
- Monitor database size
- Check authentication logs

### Vercel Analytics
- View deployment logs
- Monitor build times
- Track function invocations

## 🆘 Getting Help

If you encounter issues:

1. Check browser console for errors
2. Review Supabase logs
3. Verify all environment variables
4. Ensure database tables exist
5. Check this guide's troubleshooting section

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Vercel Documentation](https://vercel.com/docs)
