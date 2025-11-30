#!/bin/bash

# Deployment Verification Script
# Checks that everything is configured correctly for Railway deployment

echo "🔍 Verifying Railway Deployment Configuration..."
echo ""

# Check 1: .gitignore files
echo "✓ Checking .gitignore files..."
if grep -q "^dist" .gitignore && grep -q "^dist" frontend/.gitignore && grep -q "^dist" backend/.gitignore; then
    echo "  ✅ All .gitignore files properly configured"
else
    echo "  ❌ ERROR: .gitignore files missing dist/ entry"
    exit 1
fi

# Check 2: dist folders not tracked in git
echo "✓ Checking if dist/ is tracked in git..."
if git ls-files | grep -q "^.*dist/"; then
    echo "  ⚠️  WARNING: dist/ folder is tracked in git (should remove with 'git rm -r --cached dist')"
else
    echo "  ✅ dist/ is not tracked in git (good!)"
fi

# Check 3: Deployment files exist
echo "✓ Checking deployment configuration files..."
files=("build.sh" "Procfile" "railway.json" ".railwayignore" "DEPLOYMENT.md")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file exists"
    else
        echo "  ❌ ERROR: $file not found"
        exit 1
    fi
done

# Check 4: build.sh is executable
echo "✓ Checking build.sh is executable..."
if [ -x "build.sh" ]; then
    echo "  ✅ build.sh is executable"
else
    echo "  ⚠️  WARNING: build.sh is not executable"
    echo "  Run: chmod +x build.sh"
fi

# Check 5: Test build script syntax
echo "✓ Validating build.sh syntax..."
if bash -n build.sh 2>/dev/null; then
    echo "  ✅ build.sh syntax is valid"
else
    echo "  ❌ ERROR: build.sh has syntax errors"
    exit 1
fi

# Check 6: Verify git status
echo "✓ Checking git status..."
git_status=$(git status --porcelain)
if [ -z "$git_status" ]; then
    echo "  ✅ Repository is clean (all changes committed)"
else
    echo "  ⚠️  You have uncommitted changes:"
    echo "$git_status" | head -10
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Deployment Configuration Verified Successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Ready to deploy to Railway! 🚀"
echo ""
echo "Next steps:"
echo "1. Commit any remaining changes: git add . && git commit -m 'Railway deployment ready'"
echo "2. Push to your repository: git push"
echo "3. Railway will automatically build and deploy"
echo ""
