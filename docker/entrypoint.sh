#!/usr/bin/env bash
set -euo pipefail

echo "Waiting for the database to accept migrations..."
ATTEMPTS=0
until npx prisma migrate deploy; do
  ATTEMPTS=$((ATTEMPTS + 1))
  if [ "$ATTEMPTS" -ge 20 ]; then
    echo "Database never became ready after $ATTEMPTS attempts — giving up."
    exit 1
  fi
  echo "Migrate deploy failed (attempt $ATTEMPTS) — retrying in 3s..."
  sleep 3
done

echo "Seeding the database (idempotent — safe on every restart)..."
npx prisma db seed

echo "Starting Next.js..."
exec npm start
