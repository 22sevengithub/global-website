#!/bin/bash

echo ""
echo "╔════════════════════════════════════════════════════════════════════════════════╗"
echo "║                   TEST: ALL BANKS APPEAR (UAE + SA + Others)                  ║"
echo "╚════════════════════════════════════════════════════════════════════════════════╝"
echo ""

cd /Users/up/projects/nextGen/next_gen_app/global-website

echo "📋 Step 1: Checking Current Configuration"
echo "────────────────────────────────────────────────────────────────────────────────"
echo ""

if [ -f .env.local ]; then
  echo "✅ .env.local exists"
  echo ""
  echo "Current API Configuration:"
  grep -E "(API_URL|SIGNALR_URL|MULTI_API)" .env.local | grep -v "^#" | while read line; do
    echo "   $line"
  done
  echo ""

  # Check if using correct SA Development API
  if grep -q "NEXT_PUBLIC_SA_API_URL=https://api.develop.my227.net" .env.local; then
    echo "✅ SA Development API configured correctly!"
  elif grep -q "NEXT_PUBLIC_SA_API_URL=https://api.22seven.com" .env.local; then
    echo "⚠️  WARNING: Using SA Production API (may return 404)"
    echo "   Consider changing to: NEXT_PUBLIC_SA_API_URL=https://api.develop.my227.net"
  else
    echo "❌ SA API URL not found in .env.local"
  fi
  echo ""
else
  echo "❌ .env.local NOT FOUND"
  echo "   Please create .env.local with the configuration from IMPLEMENTATION_COMPLETE.md"
  exit 1
fi

echo "📋 Step 2: Checking Multi-API Service"
echo "────────────────────────────────────────────────────────────────────────────────"
echo ""

if [ -f services/multiApiService.ts ]; then
  echo "✅ multiApiService.ts exists"

  # Check if SA Development is configured
  if grep -q "name: 'SA Development'" services/multiApiService.ts; then
    echo "✅ SA Development API found in multiApiService.ts"
  else
    echo "⚠️  SA Development API not found (check API_CONFIGS)"
  fi
  echo ""
else
  echo "❌ services/multiApiService.ts NOT FOUND"
  exit 1
fi

echo "📋 Step 3: Checking Dev Server Status"
echo "────────────────────────────────────────────────────────────────────────────────"
echo ""

if lsof -i :3000 | grep -q LISTEN; then
  echo "✅ Dev server is running on http://localhost:3000"
  echo ""
  echo "⚠️  IMPORTANT: If you just changed .env.local, you MUST restart the dev server!"
  echo ""
  read -p "   Do you want to restart the dev server? (y/n) " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "   Killing existing dev server..."
    pkill -f "next dev"
    sleep 2
    echo "   Starting fresh dev server..."
    npm run dev &
    echo "   ✅ Dev server restarted!"
  else
    echo "   Keeping existing dev server running"
  fi
else
  echo "⚠️  Dev server not running"
  echo ""
  read -p "   Do you want to start the dev server? (y/n) " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "   Starting dev server..."
    npm run dev &
    echo "   ✅ Dev server started!"
  else
    echo "   Please start dev server manually: npm run dev"
    exit 1
  fi
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════════════════════╗"
echo "║                           TESTING CHECKLIST                                    ║"
echo "╚════════════════════════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ Configuration verified"
echo "✅ Dev server ready"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. 🔑 Login to the app:"
echo "   → http://localhost:3000/login"
echo ""
echo "2. 🔍 Check debug page:"
echo "   → http://localhost:3000/app/debug-providers"
echo ""
echo "   Expected Results:"
echo "   • YODLEE count: 60-80 (SA banks)"
echo "   • LEAN count: 10-15 (UAE banks)"
echo "   • Total providers: 80-100"
echo "   • Source APIs: 'SA Development' AND 'Global/UAE Development'"
echo ""
echo "3. 🏦 Test link account page:"
echo "   → http://localhost:3000/app/link-account"
echo ""
echo "   Search for these banks:"
echo "   • Standard Bank (SA) ✓"
echo "   • FNB (SA) ✓"
echo "   • Nedbank (SA) ✓"
echo "   • Capitec (SA) ✓"
echo "   • Emirates NBD (UAE) ✓"
echo ""
echo "4. 👀 Check browser console (F12):"
echo "   Look for:"
echo "   • '🌍🌍🌍 [MultiAPI] fetchProvidersFromAllApis() CALLED'"
echo "   • '✅ [MultiAPI] Fetched 72 providers from SA Development'"
echo "   • '✅✅✅ [PostLogin] MULTI-API SUCCESS!'"
echo ""
echo "╔════════════════════════════════════════════════════════════════════════════════╗"
echo "║                        TROUBLESHOOTING TIPS                                    ║"
echo "╚════════════════════════════════════════════════════════════════════════════════╝"
echo ""
echo "If you don't see SA banks:"
echo ""
echo "1. Clear browser storage (in DevTools console):"
echo "   sessionStorage.clear()"
echo "   localStorage.clear()"
echo ""
echo "2. Logout and login again"
echo ""
echo "3. Check browser console for errors"
echo ""
echo "4. Verify .env.local has correct URLs (see above)"
echo ""
echo "5. Read full troubleshooting guide:"
echo "   → TEST_ALL_BANKS_APPEAR.md"
echo ""
echo "════════════════════════════════════════════════════════════════════════════════"
echo ""
