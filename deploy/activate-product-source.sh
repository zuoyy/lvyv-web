#!/usr/bin/env bash
# Run on the Linux site host after preparing an immutable source release and npm ci.
set -euo pipefail
: "${LVYV_SITE_LOCK:?}"
: "${LVYV_PRODUCT_SOURCE:?}"
prepared_source="$(readlink -f "${1:?Pass prepared source release directory}")"
[[ -f "$prepared_source/package-lock.json" && -f "$prepared_source/scripts/product-publication.mjs" && -d "$prepared_source/node_modules/nuxt" ]]
exec 9>"$LVYV_SITE_LOCK"
flock -x 9
# A pending content receipt belongs to the old release and must be settled first.
if [[ -f "${LVYV_PUBLICATION_STATE:?}/receipt.json" ]]; then
  old_source="$(readlink -f "$LVYV_PRODUCT_SOURCE")"
  LVYV_RECOVER_ONLY=1 node "$old_source/scripts/product-publication.mjs"
fi
mkdir -p "$(dirname "$LVYV_PRODUCT_SOURCE")"
ln -s "$prepared_source" "${LVYV_PRODUCT_SOURCE}.next-$$"
mv -Tf "${LVYV_PRODUCT_SOURCE}.next-$$" "$LVYV_PRODUCT_SOURCE"
# The worker journals source identity before claiming a task and queues a rebuild.
# A restart between source switch and queue creation therefore cannot lose the update.
printf '%s\n' 'Source activated; the publication worker will build and validate the new site.'
