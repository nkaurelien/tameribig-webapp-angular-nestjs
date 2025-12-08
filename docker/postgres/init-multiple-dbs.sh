#!/bin/bash
set -e

# Script to create multiple databases in PostgreSQL
# Reads POSTGRES_MULTIPLE_DATABASES env var (comma-separated list)

function create_database() {
  local database=$1
  echo "Creating database '$database'..."
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
    SELECT 'CREATE DATABASE $database'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$database')\gexec
    GRANT ALL PRIVILEGES ON DATABASE $database TO $POSTGRES_USER;
EOSQL
  echo "Database '$database' created successfully"
}

if [ -n "${POSTGRES_MULTIPLE_DATABASES:-}" ]; then
  echo "=== Creating multiple databases: $POSTGRES_MULTIPLE_DATABASES ==="
  for db in $(echo $POSTGRES_MULTIPLE_DATABASES | tr ',' ' '); do
    create_database $db
  done
  echo "=== All databases created ==="
fi
