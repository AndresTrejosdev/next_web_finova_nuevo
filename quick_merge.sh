#!/usr/bin/env bash
# quick_merge.sh
# Uso: ./quick_merge.sh
set -euo pipefail

BRANCH="ci/prod-deploy"
MAIN="main"

echo "1) Traer remoto"
git fetch origin

echo "2) Asegurarse de tener main actualizado"
git checkout "$MAIN"
git pull origin "$MAIN"

echo "3) Traer y actualizar branch de feature"
git checkout "$BRANCH"
git pull origin "$BRANCH"

echo "4) Merge rápido a main (intentará fast-forward, si no hará merge normal)"
git checkout "$MAIN"
if git merge --ff-only "$BRANCH"; then
  echo "Merge fast-forward realizado."
else
  echo "No se pudo fast-forward. Se realizará merge normal."
  git merge --no-ff "$BRANCH" -m "chore(release): merge $BRANCH into $MAIN"
fi

echo "5) Push a main"
git push origin "$MAIN"
echo "Listo. main actualizado con los cambios de $BRANCH"
