#!/usr/bin/env bash
# Copie l'app web dans native/www : c'est ce dossier qu'embarque l'application native.
# Le service worker, le Worker Cloudflare et les fichiers de dépôt n'y sont pas : l'app native n'en a pas besoin.
set -euo pipefail
cd "$(dirname "$0")/../.."
rm -rf native/www && mkdir -p native/www
cp index.html manifest.webmanifest icon.svg confidentialite.html native/www/
cp -R css js native/www/
cp -R fonts native/www/
cp icon-192.png icon-512.png icon-maskable-512.png apple-touch-icon.png native/www/
echo "native/www prêt ($(find native/www -type f | wc -l) fichiers)"
