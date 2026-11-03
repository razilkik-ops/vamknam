#!/bin/zsh
cd "${0:A:h}"
if /usr/bin/curl -fsS http://localhost:4318/ >/dev/null 2>&1; then
  open http://localhost:4318/
  exit 0
fi
open http://localhost:4318/
exec python3 -m http.server 4318 --bind 127.0.0.1 --directory dist
