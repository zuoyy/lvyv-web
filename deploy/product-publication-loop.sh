#!/usr/bin/env bash
set -euo pipefail
: "${LVYV_SITE_LOCK:?Set shared site publication lock}"
: "${LVYV_PRODUCT_SOURCE:?Set installed, dependency-ready source path}"
while true; do
  (
    # Code deployment holds the same lock before changing the source or static symlink.
    flock -x 9
    source_dir="$(readlink -f "$LVYV_PRODUCT_SOURCE")"
    cd "$source_dir"
    if ! node scripts/product-publication.mjs; then
      printf '%s\n' 'Product publication worker will retry after the polling interval.' >&2
    fi
  ) 9>"$LVYV_SITE_LOCK"
  sleep 30
done
