#!/bin/sh
# Reconstruye index.html a partir de src/
cd "$(dirname "$0")/src" || exit 1
cat scenes.js p3a.js cat.js p3b.js p3c.js seo.js p3d.js > app.js
(cat p1.html; echo '<script>'; cat app.js; echo '</script>') > ../index.html
rm app.js
