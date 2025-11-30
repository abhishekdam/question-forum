# Quick Deployment Reference

## What Was Fixed

Your Railway deployment was serving stale content because:

- ❌ Old: `dist/` folder was committed to git
- ❌ Old: Railway used cached artifacts instead of rebuilding
- ❌ Old: No explicit build instructions

## How It's Fixed Now

- ✅ New: `dist/` is ignored by git (only in .gitignore)
- ✅ New: `build.sh` cleans artifacts before building
- ✅ New: `railway.json` tells Railway to run clean builds
- ✅ New: Fresh builds every deployment = latest content

## Files Created

```
question-forum/
├── build.sh              # Clean build script (removes dist, builds fresh)
├── Procfile              # Tells Railway how to start the app
├── railway.json          # Railway build configuration
├── .railwayignore        # Excludes unnecessary files from deployment
└── DEPLOYMENT.md         # Full deployment documentation
```

## To Deploy Now

```bash
# 1. Commit the new configuration files
git add build.sh railway.json Procfile .railwayignore
git commit -m "Add Railway deployment configuration - ensures clean builds"

# 2. Push to your repository
git push

# 3. Railway automatically detects changes and:
#    - Runs: bash build.sh
#    - Cleans old artifacts
#    - Builds fresh frontend & backend
#    - Starts backend server
#    - Users see latest code
```

## Key Points

| What                  | Why                                                | Benefit                           |
| --------------------- | -------------------------------------------------- | --------------------------------- |
| Remove dist/ from git | Build artifacts should be generated, not committed | Smaller repo, fresh builds        |
| build.sh cleans first | Ensures old files don't interfere                  | Predictable, clean builds         |
| railway.json config   | Explicit build instructions                        | No surprises, consistent behavior |

## Testing Locally

```bash
# Test the build script
bash build.sh

# Verify it created dist folders
ls -la frontend/dist/
ls -la backend/dist/
```

## Troubleshooting

**Still seeing old content?**

1. Check Railway build logs (look for "Removing frontend/dist" and "Removing backend/dist")
2. Clear browser cache
3. Trigger manual redeploy in Railway dashboard

**Build failing?**

1. Run `bash build.sh` locally to test
2. Check environment variables in Railway settings
3. Review Railway build logs for specific errors

## Next Steps

1. ✅ Files created - ready to commit
2. ✅ Test locally with `bash build.sh`
3. ✅ Push to git
4. ✅ Railway handles the rest automatically

---

**Before**: Stale content served (old dist/ in git)  
**After**: Fresh content on every deploy (clean builds)

🎉 Your deployment is now optimized!
