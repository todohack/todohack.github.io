#!/bin/sh
# Portadas riso: SVG (riso2.js) -> PNG (Edge headless 1600x900) -> JPG q82 en src/assets/img/posts.
# Uso: sh tools/portadas/render.sh [slug ...]   (sin slugs = todas)
# Si Edge ya está abierto, el comando vuelve antes de escribir la captura: por eso el perfil propio y la espera al PNG.
set -e
D=$(cd "$(dirname "$0")" && pwd); R="$D/../.."; T=$(mktemp -d)
E="${EDGE:-/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe}"
node "$D/riso2.js" "$(cygpath -w "$T")" "$@"
for f in "$T"/*.svg; do
  b=$(basename "$f" .svg)
  "$E" --headless=new --disable-gpu --hide-scrollbars --user-data-dir="$(cygpath -w "$T/edge")" --force-device-scale-factor=1 --window-size=1600,900 --screenshot="$(cygpath -w "$T/$b.png")" "file:///$(cygpath -m "$f")" >/dev/null 2>&1
  n=0; while [ ! -s "$T/$b.png" ] && [ $n -lt 30 ]; do sleep 1; n=$((n+1)); done
  [ -s "$T/$b.png" ] || { echo "Edge no generó $b.png" >&2; exit 1; }
  python -I -c "import sys;from PIL import Image;Image.open(sys.argv[1]).convert('RGB').save(sys.argv[2],'JPEG',quality=82,optimize=True,progressive=True)" "$(cygpath -w "$T/$b.png")" "$(cygpath -w "$R/src/assets/img/posts/$b.jpg")"
  echo "$b"
done
rm -rf "$T"
