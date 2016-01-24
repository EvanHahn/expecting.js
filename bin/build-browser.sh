#!/usr/bin/env bash
set -e
set -u

main () {
  local cwd
  local project_root
  local source_js
  local dist

  cwd="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
  project_root="$cwd/.."
  source_js="$project_root/expecting.js"
  dist="$project_root/dist"

  mkdir -p "$dist"

  browserify -o "$dist/expecting.js" --standalone expecting "$source_js"
}

main
