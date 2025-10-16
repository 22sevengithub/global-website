#!/bin/bash

# Switch Backend Script for Vault22
# Makes it easy to switch between SA, UAE, and other backends

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env.local"

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        Vault22 Backend Switcher                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Show current backend
if [ -f "$ENV_FILE" ]; then
    CURRENT_API=$(grep "NEXT_PUBLIC_API_URL=" "$ENV_FILE" | cut -d'=' -f2)
    echo -e "${YELLOW}Current backend:${NC} $CURRENT_API"
    echo ""
fi

# Show options
echo "Select backend environment:"
echo ""
echo -e "${GREEN}1)${NC} 🇿🇦 SA Production (api.22seven.com)"
echo "   └─ Has: SA Banks (Yodlee) ✅"
echo "   └─ For: Testing SA bank linking"
echo ""
echo -e "${GREEN}2)${NC} 🌍 Global Dev (api-global.dev.vault22.io)"
echo "   └─ Has: UAE Banks (Lean), Crypto (Vezgo)"
echo "   └─ For: Testing UAE/Global features"
echo ""
echo -e "${GREEN}3)${NC} 🏗️ Pre-Production (api.preprod.vault22.io)"
echo "   └─ Has: Maybe SA Banks (check with team)"
echo "   └─ For: Pre-deployment testing"
echo ""
echo -e "${GREEN}4)${NC} 💻 Local Development (localhost:5293)"
echo "   └─ Has: Whatever your local backend has"
echo "   └─ For: Backend development"
echo ""
echo -e "${GREEN}5)${NC} Cancel (no changes)"
echo ""

read -p "Enter choice [1-5]: " choice

case $choice in
    1)
        echo ""
        echo -e "${BLUE}Switching to SA Production...${NC}"
        API_URL="https://api.22seven.com"
        SIGNALR_URL="https://signal.22seven.com"
        DESC="🇿🇦 SA Production (SA Banks)"
        ;;
    2)
        echo ""
        echo -e "${BLUE}Switching to Global Dev...${NC}"
        API_URL="https://api-global.dev.vault22.io"
        SIGNALR_URL="https://steph.develop.my227.net"
        DESC="🌍 Global Dev (UAE Banks)"
        ;;
    3)
        echo ""
        echo -e "${BLUE}Switching to Pre-Production...${NC}"
        API_URL="https://api.preprod.vault22.io"
        SIGNALR_URL="https://steph.preprod.vault22.io"
        DESC="🏗️ Pre-Production"
        ;;
    4)
        echo ""
        echo -e "${BLUE}Switching to Local Development...${NC}"
        API_URL="http://localhost:5293"
        SIGNALR_URL="http://localhost:5293"
        DESC="💻 Local Development"
        ;;
    5)
        echo ""
        echo -e "${YELLOW}Cancelled. No changes made.${NC}"
        exit 0
        ;;
    *)
        echo ""
        echo -e "${RED}Invalid choice. Exiting.${NC}"
        exit 1
        ;;
esac

# Write new .env.local
cat > "$ENV_FILE" << EOF
# Vault22 API Configuration - $DESC
NEXT_PUBLIC_API_URL=$API_URL
NEXT_PUBLIC_SIGNALR_URL=$SIGNALR_URL
NEXT_PUBLIC_APP_VERSION=1.0.0

# Lean Technologies SDK Configuration
# Set to 'true' for sandbox/development mode, 'false' for production
NEXT_PUBLIC_LEAN_SANDBOX=true
EOF

echo ""
echo -e "${GREEN}✓ Backend switched successfully!${NC}"
echo ""
echo -e "${YELLOW}Configuration:${NC}"
echo "  API URL:     $API_URL"
echo "  SignalR URL: $SIGNALR_URL"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Restart dev server: ${BLUE}npm run dev${NC}"
echo "  2. Clear browser cache (or use incognito)"
echo "  3. Login with account for this backend"
echo "  4. Go to http://localhost:3000/app/link-account"
echo ""
echo -e "${YELLOW}Note:${NC} Each backend has separate user accounts."
echo "      You may need different credentials for this backend."
echo ""
