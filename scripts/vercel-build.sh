#!/usr/bin/env bash
set -euo pipefail

if [[ -f .env ]]; then
  set -a
  . ./.env
  set +a
fi

prisma generate

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "DATABASE_URL is not set. Skipping Prisma migration for this environment. Add DATABASE_URL in Vercel project settings before production deployment."
else
  if [[ "${DATABASE_URL:-}" == file:* ]] || [[ "${DATABASE_URL:-}" == "file:./dev.db" ]] || [[ "${DATABASE_URL:-}" == "file:./prisma/dev.db" ]]; then
    prisma db push
  else
    prisma migrate deploy
  fi
fi

next build
