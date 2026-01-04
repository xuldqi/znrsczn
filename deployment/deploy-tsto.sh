#!/usr/bin/env bash

# Safe deploy script for tsto.bambumoon.cn
# - Builds the project (if node_modules exists)
# - Rsyncs dist/ to /var/www/tsto.bambumoon.cn
# - Preserves privacy-policy.html if needed, but allows updates when content changes

set -euo pipefail

SERVER_USER="${SERVER_USER:-root}"
SERVER_HOST="${SERVER_HOST:-118.178.189.214}"
REMOTE_WEB_ROOT="${REMOTE_WEB_ROOT:-/var/www/tsto.bambumoon.cn}"
PROJECT_DIR="${PROJECT_DIR:-$(cd "$(dirname "$0")"/.. && pwd)}"

echo "==> Deploying to ${SERVER_USER}@${SERVER_HOST}:${REMOTE_WEB_ROOT}"

cd "$PROJECT_DIR"

# Build only if dependencies exist locally; otherwise instruct user to install
if [ -d node_modules ]; then
  echo "==> Building (vite build)"
  npm run build
else
  echo "!! node_modules not found. Please run: npm install && npm run build"
  exit 1
fi

if [ ! -d dist ]; then
  echo "!! dist/ not found. Build failed?"
  exit 1
fi

# Compose SSH command based on whether TSTO_PASS is provided
SSH_OPTS="-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"
if [ -n "${TSTO_PASS:-}" ]; then
  if ! command -v sshpass >/dev/null 2>&1; then
    echo "!! sshpass not found. Install it or use SSH key auth."
    exit 1
  fi
  SSHPRE=(sshpass -p "$TSTO_PASS")
else
  SSHPRE=()
fi

echo "==> Ensuring remote directory exists"
"${SSHPRE[@]}" ssh $SSH_OPTS "$SERVER_USER@$SERVER_HOST" "mkdir -p '$REMOTE_WEB_ROOT'"

echo "==> Syncing dist/ to remote (with delete to ensure updates)"
RSYNC_RSH=(ssh $SSH_OPTS)
if [ -n "${TSTO_PASS:-}" ]; then
  RSYNC_RSH=(sshpass -p "$TSTO_PASS" ssh $SSH_OPTS)
fi

# Use --delete to ensure files are properly updated, but exclude privacy policy if needed
rsync -avz --progress --delete -e "${RSYNC_RSH[*]}" \
  "$PROJECT_DIR/dist/" "$SERVER_USER@$SERVER_HOST:$REMOTE_WEB_ROOT/"

echo "==> Deployed. Basic remote checks"
"${SSHPRE[@]}" ssh $SSH_OPTS "$SERVER_USER@$SERVER_HOST" bash -lc "\
  set -e; \
  echo 'Root index:'; curl -skI https://tsto.bambumoon.cn/ | head -n 5; echo; \
  echo '/privacy-policy.html:'; curl -skI https://tsto.bambumoon.cn/privacy-policy.html | head -n 8; echo; \
  echo '/company/privacy-policy.html (should 301):'; curl -skI https://tsto.bambumoon.cn/company/privacy-policy.html | head -n 8; echo; \
  echo 'One SPA route:'; curl -skI https://tsto.bambumoon.cn/about | head -n 8; echo; \
  true \
"

echo "✅ Done. To use passwordless, set up SSH keys and rerun without TSTO_PASS."