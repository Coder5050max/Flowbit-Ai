# 📋 .gitignore Guide - What to Ignore and What to Keep

This guide explains what files and folders should be in your `.gitignore` file.

## ✅ Files/Folders to IGNORE (Already in .gitignore)

### Dependencies
- ✅ `node_modules/` - Node.js dependencies (installed via npm)
- ✅ `.pnp/`, `.pnp.js` - Yarn PnP files

### Build Outputs
- ✅ `.next/` - Next.js build output
- ✅ `out/` - Next.js export output
- ✅ `build/` - Build directories
- ✅ `dist/` - Distribution directories
- ✅ `*.tsbuildinfo` - TypeScript build info
- ✅ `*.map`, `*.min.js`, `*.min.css` - Minified/bundled files

### Environment Variables
- ✅ `.env` - Environment variables (contains secrets!)
- ✅ `.env.local` - Local environment variables
- ✅ `.env.development.local` - Development environment
- ✅ `.env.test.local` - Test environment
- ✅ `.env.production.local` - Production environment

### Python
- ✅ `venv/` - Python virtual environment
- ✅ `__pycache__/` - Python cache files
- ✅ `*.pyc`, `*.pyo`, `*.pyd` - Compiled Python files
- ✅ `*.egg-info/` - Python package metadata
- ✅ `.pytest_cache/` - Pytest cache
- ✅ `.mypy_cache/` - MyPy cache

### IDE & Editor Files
- ✅ `.vscode/` - VS Code settings
- ✅ `.idea/` - IntelliJ IDEA settings
- ✅ `*.swp`, `*.swo` - Vim swap files
- ✅ `*.sublime-project`, `*.sublime-workspace` - Sublime Text

### OS Files
- ✅ `.DS_Store` - macOS Finder metadata
- ✅ `Thumbs.db` - Windows thumbnail cache
- ✅ `Desktop.ini` - Windows folder settings

### Database
- ✅ `*.db`, `*.sqlite`, `*.sqlite3` - SQLite database files
- ✅ `*.db-journal` - SQLite journal files

### Logs & Temporary Files
- ✅ `*.log` - Log files
- ✅ `*.tmp`, `*.temp` - Temporary files
- ✅ `*.bak`, `*.backup` - Backup files

### Prisma
- ✅ `apps/api/prisma/.prisma/` - Generated Prisma client cache
- ✅ `*.prisma.bak` - Prisma backup files

### Turbo
- ✅ `.turbo/` - Turborepo cache
- ✅ `.turbo-cache/` - Turborepo cache

### Vercel
- ✅ `.vercel/` - Vercel deployment files

### Testing
- ✅ `coverage/` - Test coverage reports
- ✅ `.nyc_output/` - NYC test coverage

---

## ❌ Files/Folders to KEEP (Should be committed)

### Source Code
- ✅ All `.ts`, `.tsx`, `.js`, `.jsx` files
- ✅ All `.py` files (except in `venv/`)
- ✅ All component files
- ✅ All route files

### Configuration Files
- ✅ `package.json` - Node.js dependencies list
- ✅ `package-lock.json` - Lock file (should be committed)
- ✅ `tsconfig.json` - TypeScript configuration
- ✅ `next.config.js` - Next.js configuration
- ✅ `tailwind.config.ts` - TailwindCSS configuration
- ✅ `postcss.config.js` - PostCSS configuration
- ✅ `turbo.json` - Turborepo configuration
- ✅ `docker-compose.yml` - Docker Compose configuration
- ✅ `requirements.txt` - Python dependencies list

### Database Files
- ✅ `apps/api/prisma/schema.prisma` - Prisma schema (MUST be committed)
- ✅ `apps/api/prisma/seed.ts` - Database seed script (MUST be committed)
- ✅ `apps/api/prisma/migrations/` - Database migrations (MUST be committed)

### Data Files
- ✅ `data/Analytics_Test_Data.json` - Test data (REQUIRED for submission)

### Documentation
- ✅ All `.md` files (README.md, SETUP.md, etc.)
- ✅ All documentation files

### Public Assets
- ✅ `apps/web/public/` - Public assets (images, etc.)
- ✅ `apps/web/public/up.png` - Trend images
- ✅ `apps/web/public/down.jpg` - Trend images

### Service Files
- ✅ `services/vanna/main.py` - Vanna AI service
- ✅ `services/vanna/requirements.txt` - Python dependencies
- ✅ `services/vanna/README.md` - Service documentation

---

## 🔍 Quick Check: What Should Be Committed?

### ✅ YES - Commit These:
```
✅ apps/web/app/**/*.tsx
✅ apps/web/components/**/*.tsx
✅ apps/web/lib/**/*.ts
✅ apps/web/public/**/*
✅ apps/api/src/**/*.ts
✅ apps/api/prisma/schema.prisma
✅ apps/api/prisma/seed.ts
✅ apps/api/prisma/migrations/**
✅ services/vanna/main.py
✅ services/vanna/requirements.txt
✅ data/Analytics_Test_Data.json
✅ All *.md files
✅ package.json, package-lock.json
✅ docker-compose.yml
✅ turbo.json
✅ All config files (tsconfig.json, next.config.js, etc.)
```

### ❌ NO - Don't Commit These:
```
❌ node_modules/
❌ .env, .env.local
❌ .next/, out/, build/, dist/
❌ venv/, __pycache__/
❌ *.log, *.tmp, *.bak
❌ .DS_Store, Thumbs.db
❌ .vscode/, .idea/
❌ apps/api/prisma/.prisma/
```

---

## 🧪 Test Your .gitignore

### Check What Will Be Committed

```bash
# See what files will be committed
git status

# See what files are ignored
git status --ignored

# Check if a specific file is ignored
git check-ignore -v path/to/file
```

### Verify Important Files Are NOT Ignored

```bash
# These should NOT be ignored (should show in git status)
git check-ignore data/Analytics_Test_Data.json
# Should return nothing (not ignored)

git check-ignore apps/api/prisma/schema.prisma
# Should return nothing (not ignored)

git check-ignore apps/api/prisma/seed.ts
# Should return nothing (not ignored)
```

### Verify Unwanted Files ARE Ignored

```bash
# These should be ignored (should NOT show in git status)
git check-ignore node_modules/
# Should return: node_modules/

git check-ignore .env
# Should return: .env

git check-ignore services/vanna/venv/
# Should return: services/vanna/venv/
```

---

## 📝 Common Mistakes to Avoid

### ❌ Don't Ignore These (Common Mistakes):

1. **Don't ignore `data/Analytics_Test_Data.json`**
   - This is REQUIRED for submission
   - Must be in the repository

2. **Don't ignore `apps/api/prisma/migrations/`**
   - Migrations must be committed
   - They're part of your database schema

3. **Don't ignore `package.json` or `package-lock.json`**
   - These are needed to install dependencies
   - Must be in the repository

4. **Don't ignore `requirements.txt`**
   - Python dependencies list
   - Must be in the repository

5. **Don't ignore source code files**
   - All `.ts`, `.tsx`, `.py` files should be committed
   - Only ignore compiled/cache files

### ✅ Do Ignore These (Important):

1. **Always ignore `.env` files**
   - Contains secrets (API keys, database passwords)
   - Never commit these!

2. **Always ignore `node_modules/`**
   - Can be regenerated with `npm install`
   - Too large to commit

3. **Always ignore `venv/`**
   - Python virtual environment
   - Can be regenerated

4. **Always ignore build outputs**
   - `.next/`, `build/`, `dist/`
   - Can be regenerated

---

## 🎯 Summary

Your `.gitignore` is now properly configured to:

✅ **Ignore**:
- Dependencies (node_modules, venv)
- Build outputs (.next, build, dist)
- Environment variables (.env)
- Cache files (__pycache__, .turbo)
- IDE/OS files (.vscode, .DS_Store)
- Logs and temporary files

✅ **Keep** (commit):
- All source code
- Configuration files
- Database schema and migrations
- Test data (Analytics_Test_Data.json)
- Documentation
- Public assets

---

## 🚀 Next Steps

1. **Review your .gitignore**: Make sure it matches this guide
2. **Test it**: Run `git status` to see what will be committed
3. **Verify important files**: Make sure `data/Analytics_Test_Data.json` is NOT ignored
4. **Commit**: Add and commit your files

```bash
# Check what will be committed
git status

# Add all files (respects .gitignore)
git add .

# Commit
git commit -m "Initial commit with proper .gitignore"
```

---

**Your .gitignore is now properly configured!** ✅

