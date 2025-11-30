# Railway Deployment Guide

## Overview

This guide ensures your Question Forum application deploys correctly to Railway with fresh builds and no stale artifacts.

## Configuration Files Created

### 1. **build.sh** - Clean Build Script

- Removes all build artifacts (`dist`, `build`) before building
- Ensures Railway always creates fresh builds
- Builds both backend and frontend cleanly
- Makes deployment predictable and consistent

### 2. **Procfile** - Railway Process Definition

- Tells Railway how to start your application
- Specifies the startup command for the backend
- Railway uses this to understand your app structure

### 3. **railway.json** - Railway Configuration

- Defines build and deployment settings
- Uses nixpacks builder for consistent builds
- Specifies the build command as `bash build.sh`
- Configures restart policy for reliability

### 4. **.railwayignore** - Files to Exclude from Deployment

- Prevents uploading unnecessary files
- Excludes build artifacts, logs, node_modules
- Reduces deployment package size

### 5. **.gitignore** - Already Configured

- All `.gitignore` files already properly exclude `dist/`, `build/`, and logs
- Build artifacts won't be committed to git
- Ensures git only tracks source code, not generated files

## How Deployment Works Now

### Before (Problem):

```
1. Push code with dist/ folder to git
2. Railway pulls from git (includes stale dist/)
3. Railway might skip building or use old files
4. Users see outdated content
```

### After (Solution):

```
1. Push code without dist/ folder
2. Railway pulls from git (clean source code only)
3. Railway runs: bash build.sh
   - Removes any dist/ artifacts
   - npm install (frontend)
   - npm run build (frontend)
   - npm install (backend)
   - npm run build (backend)
4. Railway starts with fresh, clean builds
5. Users see latest content
```

## Deployment Checklist

Before pushing to Railway:

- [ ] Add new config files to git:

  ```bash
  git add build.sh railway.json Procfile .railwayignore
  git commit -m "Add Railway deployment configuration - ensures clean builds"
  git push
  ```

- [ ] Verify .gitignore includes build artifacts:

  ```bash
  # Check root .gitignore has 'dist'
  cat .gitignore | grep dist

  # Check frontend .gitignore has 'dist'
  cat frontend/.gitignore | grep dist

  # Check backend .gitignore has 'dist'
  cat backend/.gitignore | grep dist
  ```

- [ ] Verify no dist folders are tracked in git:

  ```bash
  git ls-files | grep dist/
  # Should return empty (no output)
  ```

- [ ] Test the build script locally:
  ```bash
  bash build.sh
  # Should complete without errors
  ```

## Environment Variables on Railway

Ensure these are set in Railway project settings:

### Backend Environment Variables

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key
NODE_ENV=production
PORT=4000
```

### Frontend Environment Variables (in .env.local)

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Common Issues & Solutions

### Issue: Still seeing old content after deployment

**Solution:**

1. Check Railway logs to confirm build completed
2. Verify dist folder doesn't exist in git: `git ls-files | grep dist/`
3. Manually trigger a redeploy in Railway dashboard
4. Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)

### Issue: Build fails on Railway

**Solution:**

1. Check Railway build logs for errors
2. Run `bash build.sh` locally to test
3. Verify Node.js version matches: `node --version`
4. Check environment variables are set correctly

### Issue: Build takes too long

**Solution:**

- This is normal for first deployment (npm install downloads packages)
- Subsequent deploys will be faster (caching)
- Typical build time: 2-5 minutes

## Testing Locally

Test your build script before deploying:

```bash
# From project root
bash build.sh

# Check output was created
ls -la frontend/dist/
ls -la backend/dist/

# Run the app
cd backend && npm start
```

## Future Deployments

After initial setup, every time you push to git:

1. Railway automatically detects changes
2. Runs `bash build.sh` (creates fresh artifacts)
3. Starts the backend with fresh code
4. Users see your latest changes

No manual intervention needed! ✅

## Why This Architecture Works

| Aspect                           | Benefit                                            |
| -------------------------------- | -------------------------------------------------- |
| **No dist in git**               | Source code stays clean, artifacts generated fresh |
| **build.sh cleans first**        | Removes old artifacts before building new ones     |
| **railway.json specifies build** | Clear, explicit build instructions                 |
| **.railwayignore**               | Unnecessary files don't bloat deployments          |
| **Procfile defines startup**     | Railway knows exactly how to run your app          |

## Performance Notes

- **Frontend + Backend**: Both built on deployment
- **Build time**: ~2-5 minutes typically
- **After build**: Backend starts automatically
- **Frontend**: Usually deployed separately or served from backend
- **Real-time updates**: No cache busting issues with fresh builds

---

**Status**: ✅ Deployment ready

**Last updated**: November 30, 2025
