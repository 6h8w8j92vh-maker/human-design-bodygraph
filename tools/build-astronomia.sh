#!/bin/sh
# Bundles the parts of astronomia (MIT) that the page needs into src/astronomia.js.
# Run from a folder that has astronomia@4.2.0 installed: sh build-astronomia.sh
set -e
here=$(cd "$(dirname "$0")" && pwd)
{
  echo "/*! astronomia 4.2.0 (subset) | MIT License | Copyright (c) 2013 Sonia Keys, (c) 2016 Commenthol | https://github.com/commenthol/astronomia */"
  NODE_PATH="$PWD/node_modules" npx --yes esbuild@0.28.2 "$here/astronomia-entry.js" --bundle --format=iife --global-name=Astronomia --minify --legal-comments=none --log-level=warning
} > "$here/../src/astronomia.js"
echo "wrote src/astronomia.js"
