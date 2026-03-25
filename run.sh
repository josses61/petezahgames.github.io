#!/bin/bash
# Run from workspace root: ./run.sh
# Start a local web server for petezahgames.github.io

PORT=8000

echo "Starting local server at http://localhost:${PORT}"

# If python is available, use it.
if command -v python3 >/dev/null 2>&1; then
  python3 -m http.server "$PORT"
elif command -v python >/dev/null 2>&1; then
  python -m SimpleHTTPServer "$PORT"
else
  echo "No Python found. Install Python 3 or run a node server (npx http-server . -p $PORT)."
  exit 1
fi