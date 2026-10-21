#!/usr/bin/env bash
# Build exactly like GitHub Pages does for a project repo, then serve it locally.
# Usage: scripts/preview-pages.sh [/base-path]   (default /meal-plans)
set -euo pipefail
# Stop Git Bash on Windows from rewriting "/meal-plans" into a Windows path.
export MSYS_NO_PATHCONV=1 MSYS2_ARG_CONV_EXCL="*"
BASE="${1:-/meal-plans}"
NEXT_PUBLIC_BASE_PATH="$BASE" pnpm build
rm -rf .pages-preview && mkdir -p ".pages-preview$BASE"
cp -R out/. ".pages-preview$BASE/"
echo "Open http://localhost:4173$BASE/"
npx serve .pages-preview -l 4173
