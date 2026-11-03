#!/bin/zsh
cd "${0:A:h}"
if /usr/bin/curl -fsS http://localhost:4318/ >/dev/null 2>&1; then
  open http://localhost:4318/
  exit 0
fi
python3 -m http.server 4318 --bind 127.0.0.1 --directory dist &
vamknam_server_pid=$!
trap 'kill "$vamknam_server_pid" 2>/dev/null' EXIT INT TERM
for vamknam_attempt in {1..50}; do
  if /usr/bin/curl -fsS http://localhost:4318/ >/dev/null 2>&1; then
    open http://localhost:4318/
    break
  fi
  sleep 0.1
done
wait "$vamknam_server_pid"
