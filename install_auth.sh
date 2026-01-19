#!/bin/bash

# SoozAI Authentication System - Auto Installation Script
# This script will backup old files and install new authentication system

echo "🚀 Starting SoozAI Authentication System Installation..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Create backup directory
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
echo -e "${YELLOW}📁 Creating backup directory: $BACKUP_DIR${NC}"
mkdir -p $BACKUP_DIR

# Backup old files
echo -e "${YELLOW}💾 Backing up old files...${NC}"
cp src/App.js $BACKUP_DIR/ 2>/dev/null || echo "  - App.js not found (OK)"
cp src/components/Sidebar.js $BACKUP_DIR/ 2>/dev/null || echo "  - Sidebar.js not found (OK)"
cp src/components/LoginModal.js $BACKUP_DIR/ 2>/dev/null || echo "  - LoginModal.js not found (OK)"
cp src/utils/localStorage.js $BACKUP_DIR/ 2>/dev/null || echo "  - localStorage.js not found (OK)"
echo -e "${GREEN}✅ Backup completed${NC}"
echo ""

# Create contexts directory
echo -e "${YELLOW}📂 Creating contexts directory...${NC}"
mkdir -p src/contexts
echo -e "${GREEN}✅ Contexts directory created${NC}"
echo ""

# Copy new files
echo -e "${YELLOW}📝 Installing new files...${NC}"

# Copy AuthContext
if [ -f "src/contexts/AuthContext.js" ]; then
    echo "  ❌ AuthContext.js already exists, skipping..."
else
    cp contexts/AuthContext.js src/contexts/AuthContext.js 2>/dev/null && echo -e "  ${GREEN}✅ AuthContext.js${NC}" || echo -e "  ${RED}❌ Failed to copy AuthContext.js${NC}"
fi

# Replace main files
echo -e "${YELLOW}🔄 Replacing main application files...${NC}"
cp src/App_New.js src/App.js && echo -e "  ${GREEN}✅ App.js${NC}" || echo -e "  ${RED}❌ Failed to update App.js${NC}"
cp src/components/Sidebar_New.js src/components/Sidebar.js && echo -e "  ${GREEN}✅ Sidebar.js${NC}" || echo -e "  ${RED}❌ Failed to update Sidebar.js${NC}"
cp src/components/LoginModal_New.js src/components/LoginModal.js && echo -e "  ${GREEN}✅ LoginModal.js${NC}" || echo -e "  ${RED}❌ Failed to update LoginModal.js${NC}"
cp src/utils/userStorage.js src/utils/localStorage.js && echo -e "  ${GREEN}✅ localStorage.js (userStorage)${NC}" || echo -e "  ${RED}❌ Failed to update localStorage.js${NC}"

echo ""

# Update CSS files
echo -e "${YELLOW}🎨 Updating CSS files...${NC}"
cp src/styles/LoginModal_New.css src/styles/LoginModal.css && echo -e "  ${GREEN}✅ LoginModal.css${NC}" || echo -e "  ${RED}❌ Failed to update LoginModal.css${NC}"
cat src/styles/Sidebar_Additions.css >> src/styles/Sidebar.css && echo -e "  ${GREEN}✅ Sidebar.css (additions appended)${NC}" || echo -e "  ${RED}❌ Failed to update Sidebar.css${NC}"

echo ""

# Clean up temporary files (optional)
echo -e "${YELLOW}🧹 Cleaning up...${NC}"
# Uncomment these lines if you want to remove the _New files after installation
# rm src/App_New.js src/components/Sidebar_New.js src/components/LoginModal_New.js 2>/dev/null
# rm src/styles/LoginModal_New.css src/styles/Sidebar_Additions.css 2>/dev/null
echo -e "${GREEN}✅ Cleanup completed${NC}"

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✨ Installation Complete! ✨${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "  1. npm start - Start the development server"
echo "  2. Open http://localhost:3000"
echo "  3. Click 'Login Here' to test authentication"
echo "  4. Try registering a new account"
echo "  5. Test Google Sign-In"
echo ""
echo -e "${YELLOW}📚 Documentation:${NC}"
echo "  - Read IMPLEMENTATION_GUIDE_COMPLETE.md for full details"
echo "  - Your old files are backed up in: $BACKUP_DIR"
echo ""
echo -e "${YELLOW}🎯 New Features:${NC}"
echo "  ✅ Login & Register with email/password"
echo "  ✅ Google OAuth authentication"
echo "  ✅ Protected dashboard (login required)"
echo "  ✅ Logout functionality"
echo "  ✅ User-wise chat storage"
echo "  ✅ Export/Import data to text files"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
