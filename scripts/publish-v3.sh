#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PUBLISH_DIR="$(mktemp -d)"
trap 'rm -rf "$PUBLISH_DIR"' EXIT

cd "$PROJECT_ROOT"
npm run build

gh repo clone nagisa77/nagisa77.github.io "$PUBLISH_DIR/site" -- --quiet
cd "$PUBLISH_DIR/site"
if git show-ref --verify --quiet refs/remotes/origin/v3; then
  git switch --track origin/v3
else
  git switch --orphan v3
fi
git rm -r --ignore-unmatch . >/dev/null 2>&1 || true
cp -R "$PROJECT_ROOT/dist/." .
touch .nojekyll
git add -- .
if git diff --cached --quiet; then
  echo "v3 already matches the latest build."
  exit 0
fi
git commit -m "deploy: Tim blogs v3"
git push origin v3
