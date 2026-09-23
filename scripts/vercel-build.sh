#!/usr/bin/env bash
set -euo pipefail

if [[ -f .env ]]; then
  set -a
  . ./.env
  set +a
fi

prisma generate

if [[ "${DATABASE_URL:-}" == file:* ]] || [[ "${DATABASE_URL:-}" == "file:./dev.db" ]] || [[ "${DATABASE_URL:-}" == "file:./prisma/dev.db" ]]; then
  prisma db push
else
  prisma migrate deploy
fi

next build
