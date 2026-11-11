#!/usr/bin/env bash

set -Eeuo pipefail

# Static-page deployment for the Nginx-hosted lvyv-web site. FAQ SSR is
# deployed separately with deploy/deploy-ssr.sh.
# Credentials are supplied explicitly through the environment.

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

SERVER_IP="${SERVER_IP:-101.201.235.175}"
SERVER_USER="${SERVER_USER:-root}"
SERVER_PASS="${SERVER_PASS:-}"
SERVER_PORT="${SERVER_PORT:-22}"
REMOTE_WEB_ROOT="${REMOTE_WEB_ROOT:-/usr/share/nginx/web}"
REMOTE_NGINX_CONFIG="${REMOTE_NGINX_CONFIG:-/etc/nginx/conf.d/web.conf}"
DEPLOY_NGINX_CONFIG="${DEPLOY_NGINX_CONFIG:-true}"

RELEASE_ID="$(date +%Y%m%d%H%M%S)-$(git rev-parse --short HEAD 2>/dev/null || printf 'local')"
LOCAL_ARCHIVE="/tmp/lvyv-web-${RELEASE_ID}.tar.gz"
REMOTE_ARCHIVE="/var/tmp/lvyv-web-${RELEASE_ID}.tar.gz"
REMOTE_CONFIG_STAGED="/var/tmp/lvyv-web.conf-${RELEASE_ID}"

cleanup_local() {
  rm -f "$LOCAL_ARCHIVE"
}

trap cleanup_local EXIT

require_command() {
  command -v "$1" >/dev/null 2>&1 || {
    printf 'Missing required command: %s\n' "$1" >&2
    exit 1
  }
}

require_command node
require_command npm
require_command tar
require_command ssh
require_command scp

NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
NODE_MINOR="$(node -p 'process.versions.node.split(".")[1]')"
if (( NODE_MAJOR < 24 || NODE_MAJOR > 25 || (NODE_MAJOR == 24 && NODE_MINOR < 11) )); then
  printf 'Unsupported Node.js version: %s. Use Node.js 24.11 or newer within the 24.x or 25.x line.\n' "$(node --version)" >&2
  exit 1
fi

SSH_OPTIONS=(-p "$SERVER_PORT" -o StrictHostKeyChecking=accept-new)
SCP_OPTIONS=(-P "$SERVER_PORT" -o StrictHostKeyChecking=accept-new)

if [[ -n "$SERVER_PASS" ]]; then
  require_command sshpass
  export SSHPASS="$SERVER_PASS"
  SSH_OPTIONS+=(-o PreferredAuthentications=password -o PubkeyAuthentication=no)
  SCP_OPTIONS+=(-o PreferredAuthentications=password -o PubkeyAuthentication=no)
  SSH_CMD=(sshpass -e ssh "${SSH_OPTIONS[@]}")
  SCP_CMD=(sshpass -e scp "${SCP_OPTIONS[@]}")
else
  SSH_CMD=(ssh "${SSH_OPTIONS[@]}")
  SCP_CMD=(scp "${SCP_OPTIONS[@]}")
fi

printf '%s\n' '=============================================='
printf 'Deploying lvyv-web to %s@%s:%s\n' "$SERVER_USER" "$SERVER_IP" "$REMOTE_WEB_ROOT"
printf '%s\n' '=============================================='

printf '%s\n' 'Step 1: generating the Nuxt static pages...'
NUXT_CONTENT_API_BASE="${NUXT_CONTENT_API_BASE:-http://47.109.99.83:8088/web-api}" \
  NUXT_PUBLIC_API_BASE="${NUXT_PUBLIC_API_BASE:-/web-api}" \
  npm run generate

[[ -f .output/public/index.html ]] || {
  printf 'Build did not produce .output/public/index.html\n' >&2
  exit 1
}

printf '%s\n' 'Step 2: creating the release archive...'
# Keep macOS Finder and resource-fork metadata out of the Linux release.
export COPYFILE_DISABLE=1
tar --exclude='.DS_Store' --exclude='._*' -czf "$LOCAL_ARCHIVE" -C .output/public .

printf '%s\n' 'Step 3: uploading the release...'
"${SSH_CMD[@]}" "$SERVER_USER@$SERVER_IP" "mkdir -p '$(dirname "$REMOTE_WEB_ROOT")/lvyv-web-releases'"
"${SCP_CMD[@]}" "$LOCAL_ARCHIVE" "$SERVER_USER@$SERVER_IP:$REMOTE_ARCHIVE"

if [[ "$DEPLOY_NGINX_CONFIG" == "true" ]]; then
  [[ -f web.conf ]] || {
    printf 'web.conf is required when DEPLOY_NGINX_CONFIG=true\n' >&2
    exit 1
  }
  "${SCP_CMD[@]}" web.conf "$SERVER_USER@$SERVER_IP:$REMOTE_CONFIG_STAGED"
fi

REMOTE_ACTIVATE_SCRIPT="/var/tmp/lvyv-web-activate-${RELEASE_ID}.sh"
LOCAL_ACTIVATE_SCRIPT="/tmp/lvyv-web-activate-${RELEASE_ID}.sh"

cat <<'REMOTE_SCRIPT' > "$LOCAL_ACTIVATE_SCRIPT"
#!/usr/bin/env bash
set -Eeuo pipefail

archive="$1"
staged_config="$2"
web_root="$3"
nginx_config="$4"
release_id="$5"
deploy_nginx_config="$6"
script_self="$7"

# Shared with the non-root content worker. Provision this lock path with shared group permissions.
exec 9>/run/lock/lvyv-site/publish.lock
flock -x 9
if [[ -f /etc/lvyv/product-publication.env ]]; then
  printf '%s\n' 'Content publication is installed. Activate the prepared source with deploy/activate-product-source.sh instead.' >&2
  exit 1
fi
releases_root="$(dirname "$web_root")/lvyv-web-releases"
release_dir="$releases_root/$release_id"
previous_target=""
config_backup="${nginx_config}.backup.${release_id}"

reload_nginx() {
  if command -v systemctl >/dev/null 2>&1 && systemctl is-active --quiet nginx; then
    systemctl reload nginx && return 0
  fi
  nginx -s reload
}

rollback() {
  if [[ "$deploy_nginx_config" == "true" ]]; then
    if [[ -f "$config_backup" ]]; then
      install -m 0644 "$config_backup" "$nginx_config"
    else
      rm -f "$nginx_config"
    fi
  fi

  if [[ -n "$previous_target" && -e "$previous_target" ]]; then
    ln -sfn "$previous_target" "${web_root}.rollback-${release_id}"
    mv -Tf "${web_root}.rollback-${release_id}" "$web_root"
  else
    rm -f "$web_root"
  fi
}

cleanup_remote() {
  rm -f "$archive" "$staged_config" "$script_self"
}

trap cleanup_remote EXIT

mkdir -p "$releases_root" "$release_dir"
tar -xzf "$archive" -C "$release_dir"

if [[ "$deploy_nginx_config" == "true" ]]; then
  if [[ -f "$nginx_config" ]]; then
    cp -a "$nginx_config" "$config_backup"
  fi
  install -m 0644 "$staged_config" "$nginx_config"
fi

if [[ -L "$web_root" ]]; then
  previous_target="$(readlink -f "$web_root" 2>/dev/null || true)"
elif [[ -e "$web_root" ]]; then
  previous_target="${web_root}.legacy-${release_id}"
  mv "$web_root" "$previous_target"
fi

ln -sfn "$release_dir" "${web_root}.next-${release_id}"
mv -Tf "${web_root}.next-${release_id}" "$web_root"

if ! nginx -t; then
  printf 'Nginx configuration test failed; rolling back.\n' >&2
  rollback
  exit 1
fi

if ! reload_nginx; then
  printf 'Nginx reload failed; rolling back.\n' >&2
  rollback
  nginx -t
  reload_nginx || true
  exit 1
fi

# Keep the release that was active before this deployment for rollback.
if [[ "$(readlink -f "$web_root")" == "$release_dir" ]]; then
  for old_release in "$releases_root"/*; do
    [[ -d "$old_release" ]] || continue
    [[ "$(basename "$old_release")" == products-* ]] && continue
    [[ "$old_release" == "$release_dir" || "$old_release" == "$previous_target" ]] && continue
    rm -rf -- "$old_release"
  done
fi

printf 'Release %s is active at %s\n' "$release_id" "$web_root"
REMOTE_SCRIPT

"${SCP_CMD[@]}" "$LOCAL_ACTIVATE_SCRIPT" "$SERVER_USER@$SERVER_IP:$REMOTE_ACTIVATE_SCRIPT"
rm -f "$LOCAL_ACTIVATE_SCRIPT"

printf '%s\n' 'Step 4: switching the Nginx release atomically...'
"${SSH_CMD[@]}" "$SERVER_USER@$SERVER_IP" bash "$REMOTE_ACTIVATE_SCRIPT" \
  "$REMOTE_ARCHIVE" \
  "$REMOTE_CONFIG_STAGED" \
  "$REMOTE_WEB_ROOT" \
  "$REMOTE_NGINX_CONFIG" \
  "$RELEASE_ID" \
  "$DEPLOY_NGINX_CONFIG" \
  "$REMOTE_ACTIVATE_SCRIPT"

printf '%s\n' '=============================================='
printf 'Deployment complete: https://www.lvyv.com/\n'
printf 'FAQ center: https://help.lvyv.com/\n'
printf '%s\n' '=============================================='
