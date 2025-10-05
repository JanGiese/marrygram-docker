#!/bin/bash

# Function to execute a single SQL file
execute_sql_file() {
    local sql_file="$1"
    local db_name="$2"
    echo ${APP_DB_USER}
      # Set variables for create user script
      psql -d "${db_name}" -f "${sql_file}" \
           -v ON_ERROR_STOP=1 \
           -v appUser="${APP_DB_USER}" \
           -v appPassword="${APP_DB_PASSWORD}" \
           -v appDbName="${POSTGRES_DB}" \
           -v test="Test"
}

# Function to execute all SQL files in a directory
execute_sql_files_in_dir() {
    local sql_dir="$1"
    local db_name="$2"

    # find all .sql files in sql directory and execute them in alphabetical order
    for sql_file in $(find "${sql_dir}" -name "*.sql" | sort); do
        echo "📂 Executing ${sql_file}..."
        if ! execute_sql_file "${sql_file}" "${db_name}"; then
            echo "❌ Error: Failed to execute ${sql_file}"
            exit 1
        fi
        echo "✅ Successfully executed ${sql_file}"
    done
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "🔧 Starting database initialization..."

# Execute all SQL files in the postgres directory
execute_sql_files_in_dir "${SCRIPT_DIR}/postgres" "postgres"
execute_sql_files_in_dir "${SCRIPT_DIR}/app" "${POSTGRES_DB}"

echo "✅ Database initialization completed successfully!"
