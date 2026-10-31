#!/bin/sh
# Runs a hook script with the repo's .nvmrc Node. The hook environment's
# PATH may have no node, or an old system node that can't run ES modules.
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh" >/dev/null 2>&1
  nvm use --silent "$(cat "$(dirname "$0")/../../.nvmrc")" >/dev/null 2>&1
fi
exec node "$@"
