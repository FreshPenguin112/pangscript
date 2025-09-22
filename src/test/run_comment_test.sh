#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
# repo root is two levels up from src/test
ROOT=$(cd "$SCRIPT_DIR/../.." && pwd)
cd "$ROOT"
echo "Running comment test..."
node src/index.js -d -c src/test/pangconfig.jsonh -i src/test/test_comments.lua -o src/test/test_comments_out.pmp
echo "Extracting project.json from generated PMP..."
unzip -p src/test/test_comments_out.pmp project.json | jq '.targets[] | {name: .name, blocks: (.blocks|keys), comments: .comments.a}'

