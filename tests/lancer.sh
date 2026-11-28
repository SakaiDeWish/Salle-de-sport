#!/usr/bin/env bash
# Lance la suite de tests de bout en bout. Usage : bash tests/lancer.sh [nom ...]
# Pré-requis : node, playwright-core et un Chromium (voir tests/README.md).
cd "$(dirname "$0")"
mkdir -p sortie && cd sortie
liste=("$@"); [ ${#liste[@]} -eq 0 ] && liste=($(ls ../*.js | xargs -n1 basename | sed 's/\.js$//' | grep -v '^lib$' | sort -V))
ok=0; ko=0
for t in "${liste[@]}"; do
  out=$(timeout 150 node "../$t.js" 2>&1); code=$?
  if [ $code -eq 0 ] && ! echo "$out" | grep -qE "TypeError|TimeoutError|ÉCHECS [1-9]|PROBLÈMES [1-9]|erreurs : [^a]|ERR \[.+\]"; then ok=$((ok+1)); echo "  ok   $t"
  else ko=$((ko+1)); echo "  ÉCHEC $t"; echo "$out" | grep -E "TypeError|TimeoutError|ÉCHECS|PROBLÈMES|erreurs :|ERR \[" | head -3 | sed 's/^/        /'; fi
done
echo "$ok réussis, $ko en échec"; [ $ko -eq 0 ]
