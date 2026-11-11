#!/usr/bin/env bash
set -Eeuo pipefail

log() {
  printf '[deploy-ssr] %s\n' "$*" >&2
}

on_error() {
  local status=$?
  log "FAILED (exit ${status}) at line ${BASH_LINENO[0]}: ${BASH_COMMAND}"
  exit "$status"
}

trap on_error ERR

# Build and atomically activate the Nuxt node-server output. The remote
# systemd unit remains on the previous release if health checks fail.
root_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root_dir"
release_id="$(date +%Y%m%d%H%M%S)-$(git rev-parse --short HEAD 2>/dev/null || printf local)"
remote="${SSR_REMOTE:-root@101.201.235.175}"
remote_root="${SSR_REMOTE_ROOT:-/var/www/lvyv-web}"
archive="/tmp/lvyv-web-ssr-${release_id}.tar.gz"
server_pass="${SERVER_PASS:-}"

if [[ -n "$server_pass" ]]; then
  export SSHPASS="$server_pass"
  ssh_cmd=(sshpass -e ssh -o StrictHostKeyChecking=accept-new -o PreferredAuthentications=password -o PubkeyAuthentication=no)
  scp_cmd=(sshpass -e scp -o StrictHostKeyChecking=accept-new -o PreferredAuthentications=password -o PubkeyAuthentication=no)
else
  ssh_cmd=(ssh -o StrictHostKeyChecking=accept-new)
  scp_cmd=(scp -o StrictHostKeyChecking=accept-new)
fi

log "Starting release ${release_id} to ${remote}:${remote_root}"
log "Building Nuxt SSR output"
NUXT_CONTENT_API_BASE="${NUXT_CONTENT_API_BASE:-http://47.109.99.83:8088/web-api}" \
  NUXT_PUBLIC_API_BASE="${NUXT_PUBLIC_API_BASE:-/web-api}" \
  npm run build
test -f .output/server/index.mjs
log "Creating release archive"
tar --exclude='.DS_Store' --exclude='._*' -czf "$archive" -C .output .
log "Uploading release archive"
"${scp_cmd[@]}" "$archive" "$remote:/var/tmp/"
log "Uploading systemd unit"
"${scp_cmd[@]}" deploy/lvyv-web-ssr.service "$remote:/var/tmp/lvyv-web-ssr.service"
log "Activating release remotely and waiting for health check"
local_ssr_script="/tmp/lvyv-web-ssr-activate-${release_id}.sh"
remote_ssr_script="/var/tmp/lvyv-web-ssr-activate-${release_id}.sh"

cat <<'REMOTE' > "$local_ssr_script"
#!/usr/bin/env bash
set -Eeuo pipefail

log() {
  printf '[deploy-ssr][remote] %s\n' "$*" >&2
}

on_error() {
  local status=$?
  log "FAILED (exit ${status}) at line ${BASH_LINENO[0]}: ${BASH_COMMAND}"
  exit "$status"
}

trap on_error ERR

release_id="$1"; root="$2"; script_self="$3"; archive="/var/tmp/lvyv-web-ssr-${release_id}.tar.gz"
# Shared with the non-root content worker. Provision this lock path with shared group permissions.
exec 9>/run/lock/lvyv-site/publish.lock
flock -x 9
release_dir="$root/releases/$release_id"
log "Preparing release directory ${release_dir}"
mkdir -p "$root/releases"
rm -rf "$release_dir"
mkdir -p "$release_dir"
tar -xzf "$archive" -C "$release_dir"
if id nginx >/dev/null 2>&1; then
  chown -R nginx:nginx "$release_dir"
fi
previous=""
if [[ -L "$root/current" ]]; then
  candidate="$(readlink -f "$root/current" 2>/dev/null || true)"
  if [[ -n "$candidate" && -d "$candidate" && "$candidate" == "$root/releases/"* ]]; then
    previous="$candidate"
  fi
fi
log "Switching current symlink"
ln -sfn "$release_dir" "$root/current.next"
mv -Tf "$root/current.next" "$root/current"
install -m 0644 /var/tmp/lvyv-web-ssr.service /etc/systemd/system/lvyv-web-ssr.service
systemctl daemon-reload
systemctl enable lvyv-web-ssr >/dev/null
log "Restarting lvyv-web-ssr"
systemctl restart lvyv-web-ssr
health_ok=false
for i in {1..60}; do
  if ss -ltn | grep -q ':3001 '; then
    if curl --fail --silent --output /dev/null --max-time 3 http://127.0.0.1:3001/check; then
      health_ok=true
      break
    fi
  fi
  sleep 1
done
if [[ "$health_ok" != "true" ]]; then
  systemctl status lvyv-web-ssr --no-pager -l >&2 || true
  journalctl -u lvyv-web-ssr -n 120 --no-pager >&2 || true
  if [[ -n "$previous" && "$previous" != "$release_dir" ]]; then
    ln -sfn "$previous" "$root/current.next"
    mv -Tf "$root/current.next" "$root/current"
    systemctl restart lvyv-web-ssr
  fi
  echo 'SSR health check failed; previous release retained' >&2
  exit 1
fi
log "Health check passed on http://127.0.0.1:3001/check"
if [[ "$(readlink -f "$root/current")" == "$release_dir" ]]; then
  for old_release in "$root"/releases/*; do
    [[ -d "$old_release" ]] || continue
    [[ "$(basename "$old_release")" == products-* ]] && continue
    [[ "$old_release" == "$release_dir" || "$old_release" == "$previous" ]] && continue
    rm -rf -- "$old_release"
  done
else
  log "Active release changed; skipping old-release cleanup"
fi
rm -f "$archive" /var/tmp/lvyv-web-ssr.service "$script_self"
REMOTE

"${scp_cmd[@]}" "$local_ssr_script" "$remote:$remote_ssr_script"
rm -f "$local_ssr_script"
"${ssh_cmd[@]}" "$remote" bash "$remote_ssr_script" "$release_id" "$remote_root" "$remote_ssr_script"
log "Remote activation completed successfully"
rm -f "$archive"
printf 'SSR deployment succeeded: %s\n' "$release_id"
