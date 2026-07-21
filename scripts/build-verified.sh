#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

project_root="$(cd "${script_dir}/.." && pwd)"
vinext="${project_root}/node_modules/.bin/vinext"
if [[ ! -x "${vinext}" ]]; then
  echo "vinext is unavailable. Run npm ci before building." >&2
  exit 69
fi

echo "Running vinext build..."
"${vinext}" build

"${script_dir}/validate-artifact.sh"
