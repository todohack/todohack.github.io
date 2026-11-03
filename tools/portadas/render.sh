#!/bin/sh
# Portadas riso: SVG (riso2.js) -> PNG (Edge headless 1600x900) -> JPG q82 en src/assets/img/posts.
# Uso: sh tools/portadas/render.sh [slug ...]   (sin slugs = todas)
set -e
D=$(cd "$(dirname "$0")" && pwd); R="$D/../.."; T=$(mktemp -d)
E="${EDGE:-/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe}"
node "$D/riso2.js" "$(cygpath -w "$T")" "$@"
for f in "$T"/*.svg; do
  b=$(basename "$f" .svg)
  "$E" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=1600,900 --screenshot="$(cygpath -w "$T/$b.png")" "file:///$(cygpath -m "$f")" >/dev/null 2>&1
  python -I -c "import sys;from PIL import Image;Image.open(sys.argv[1]).convert('RGB').save(sys.argv[2],'JPEG',quality=82,optimize=True,progressive=True)" "$(cygpath -w "$T/$b.png")" "$(cygpath -w "$R/src/assets/img/posts/$b.jpg")"
  echo "$b"
done
rm -rf "$T"
