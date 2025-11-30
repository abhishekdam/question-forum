# Pre-Deployment Checklist

## Step 1: Review Documentation

- [ ] Read `DEPLOYMENT.md` for complete understanding
- [ ] Read `DEPLOYMENT_QUICK_START.md` for quick reference
- [ ] Understand why `dist/` shouldn't be in git

## Step 2: Verify Configuration

- [ ] Run `bash verify-deployment.sh` to verify everything
- [ ] All checks pass with green ✅ marks
- [ ] No dist/ folders tracked in git

## Step 3: Environment Variables

- [ ] Set in Railway dashboard:
  - [ ] `SUPABASE_URL` = your Supabase URL
  - [ ] `SUPABASE_KEY` = your Supabase key
  - [ ] `NODE_ENV` = production
- [ ] Note: .env files are in .gitignore, not committed

## Step 4: Test Locally (Optional but Recommended)

```bash
# Test the build script
bash build.sh

# This should:
# ✓ Remove old dist/build folders
# ✓ Install dependencies
# ✓ Build frontend
# ✓ Build backend
# ✓ Complete without errors
```

## Step 5: Commit and Push

```bash
# Add all new deployment files
git add build.sh railway.json Procfile .railwayignore
git add DEPLOYMENT.md DEPLOYMENT_QUICK_START.md verify-deployment.sh

# Commit with clear message
git commit -m "Add Railway deployment configuration - ensures clean builds"

# Push to repository
git push
```

## Step 6: Monitor Deployment

- [ ] Go to Railway dashboard
- [ ] Check that Railway detected the push
- [ ] Monitor build process:
  - Should see "Removing frontend/dist"
  - Should see "Removing backend/dist"
  - Should see "Building..."
  - Should complete successfully
- [ ] Check logs for any errors

## Step 7: Test Deployed App

- [ ] Visit your Railway app URL
- [ ] Test all functionality:
  - [ ] Create a post
  - [ ] Upvote a post
  - [ ] Mark post as answered
  - [ ] Reply to a post
  - [ ] Delete a post
- [ ] Check browser DevTools → Network tab
  - Verify asset hashes are fresh (not cached)
  - Verify no 404 errors

## Step 8: Verify Fix

- [ ] Users see latest content (no stale pages)
- [ ] Updates appear instantly
- [ ] No need to refresh page for latest code

## Troubleshooting

### Build still fails?

- [ ] Check Railway logs for specific errors
- [ ] Run `bash build.sh` locally to test
- [ ] Verify environment variables are set
- [ ] Check Node.js version compatibility

### Still seeing old content?

- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Check Railway build logs
- [ ] Verify dist/ not in git: `git ls-files | grep dist/`
- [ ] Trigger manual redeploy from Railway dashboard

### Deployment takes too long?

- This is normal for first deployment (npm install downloads all packages)
- Subsequent deployments will be faster
- Typical: 2-5 minutes per deployment

## Success Indicators ✅

Your deployment is working correctly when:

- [ ] Build logs show "Removing frontend/dist"
- [ ] Build logs show "Removing backend/dist"
- [ ] Build completes without errors
- [ ] App starts successfully
- [ ] Latest changes are visible on deployed app
- [ ] No stale content appears
- [ ] Updates work instantly (no page refresh needed)

## Support

- **Full Guide**: See `DEPLOYMENT.md`
- **Quick Start**: See `DEPLOYMENT_QUICK_START.md`
- **Verify Setup**: Run `bash verify-deployment.sh`

---

**When all boxes are checked, your deployment is complete and optimized!** 🎉

Last Updated: November 30, 2025
