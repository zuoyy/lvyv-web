# Product static publication

The public product pages are generated from a single versioned backend snapshot. A non-root systemd worker checks the durable publication queue every 30 seconds, coalesces edits, generates the complete site with the installed source and locked dependencies, verifies HTML/payload/Sitemap/assets, then switches the static release symlink. A failed build leaves the previous release active. Product availability and prices remain live browser requests.

## Prerequisites

- Apply `lvyv-server/db/mysql/patch-20261110-product-presentation-publication.sql` before deploying the compatible backend. The migration is repeatable and its definitions are included in the normal schema files.
- Configure a public, stable HTTPS asset origin for product photos and upload references. Do not publish temporary object-storage signatures.
- Configure `lvyv.product-publication.worker-secret` on the backend and `LVYV_PUBLICATION_KEY` in `/etc/lvyv/product-publication.env` with the same random value of at least 32 characters. Keep the environment file mode `0600`.
- Provision the `lvyv-publisher` account, state/release directories, and `/run/lock/lvyv-site/publish.lock` with shared group access for the publisher and code deployment account. Point Nginx's static root at `LVYV_STATIC_LINK`.
- Prepare each source release on a compatible Linux host with `npm ci`; install it in a versioned directory whose source and lockfile are not changed during content publishing. Give the publisher write access to its build outputs (`.nuxt` and `.output`). The content worker never installs dependencies or fetches source code.
- Install `deploy/lvyv-product-publication.service` and `deploy/product-publication-loop.sh`; set all paths and asset origins in the environment file.

## Host installation

Run these provisioning commands as root on the Linux site host, from the deployed source directory. Adjust the service's `ReadWritePaths` if using paths outside the supplied `/srv/lvyv-web` and `/var/lib/lvyv-publication` defaults.

```sh
id lvyv-publisher >/dev/null 2>&1 || useradd --system --home-dir /srv/lvyv-web --shell /usr/sbin/nologin lvyv-publisher
install -d -m 0755 /opt/lvyv /etc/lvyv /srv/lvyv-web
install -d -m 0755 -o lvyv-publisher -g lvyv-publisher /srv/lvyv-web/releases /srv/lvyv-web/source
install -d -m 0750 -o lvyv-publisher -g lvyv-publisher /var/lib/lvyv-publication
install -m 0755 deploy/product-publication-loop.sh /opt/lvyv/product-publication-loop.sh
install -m 0644 deploy/lvyv-product-publication.service /etc/systemd/system/lvyv-product-publication.service
install -m 0644 deploy/lvyv-product-publication.tmpfiles.conf /etc/tmpfiles.d/lvyv-product-publication.conf
systemd-tmpfiles --create /etc/tmpfiles.d/lvyv-product-publication.conf
```

Install `product-publication.env.example` as `/etc/lvyv/product-publication.env` with mode `0600` only when that file does not already exist. Fill its credential and paths before starting the service. The backend explicitly reads `LVYV_PRODUCT_PUBLICATION_WORKER_SECRET`; it must equal `LVYV_PUBLICATION_KEY`. Install Node.js/npm in the systemd PATH and use the repository-supported runtime. Give the Nginx account read/traverse access to activated static releases; give non-root code-deployment accounts membership in the lock's group.

Activate the prepared source with the environment exported (for example, root may use `set -a; . /etc/lvyv/product-publication.env; set +a`), then run `systemctl daemon-reload` and `systemctl enable --now lvyv-product-publication`. These instructions do not execute a deployment by themselves.

## Code release and initial rollout

Deploy the compatible backend, admin and Nuxt SSR runtime first. Prepare and activate a dependency-ready Nuxt source with `deploy/activate-product-source.sh /path/to/prepared-release`; this command takes the same site lock as static and SSR deployments. The worker notices a new source identity, queues a complete rebuild, and verifies it before changing the static root. Existing static deployments are refused once `/etc/lvyv/product-publication.env` is installed; use the source activation workflow for subsequent releases.

For first activation, retain the existing SSR fallback until the complete product snapshot has generated successfully. Only then enable the static-first location rules in `web.conf`. The exact product locations serve generated HTML; missing product files go to uncached SSR, and unknown/unpublished product codes return 404. Preserve the previous static release for rollback.

## Operations

The backend coalesces edits for 30 seconds. Publication retries failed builds three times with 30/60/120 second backoff. Admin status distinguishes saved target version from the published site version; use its retry action after a terminal failure. The normal five-minute target depends on product count, image storage and build-host capacity. Measure a full production-scale generation; this repository does not claim that target has been met until that measurement is recorded.

Check `systemctl status lvyv-product-publication`, `journalctl -u lvyv-product-publication`, the backend publication status endpoint and the active `product-release.json`. Logs contain only a stable error code, not source payloads, URLs or credentials. Monitor delayed tasks, failures, static 404s, booking-summary errors and HTML cache hit behavior. The sitemap is part of the same activated static release as its pages.


## Validation record

Repository checks include TypeScript and production builds for both frontends, real `npm run generate` with a Chongqing two-day fixture, a noindex product and a legacy product without an update timestamp, all-day/body/metadata/JSON-LD/Sitemap validation, backend presentation/public-content unit tests, and publication recovery tests. The fixture includes script-closing text to verify safe serialization. A separate Testcontainers/MySQL test covers migration replay, transaction rollback, concurrent claims, stale receipts, lease expiration and retry budget; run it on a Docker-enabled host before rollout. No production site has been changed by these repository checks.
