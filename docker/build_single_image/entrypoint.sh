#!/bin/bash
# entrypoint.sh

# Exit script in case of error
set -e

# Navigate to the application directory
cd /psgui

# Install dependencies only if needed
if [ -z "$(ls -A /psgui/node_modules)" ]; then
  echo "Installing dependencies..."
  yarn install
fi

# Build the project
echo "Building the project..."
yarn build

# Start supervisor to manage processes
echo "Starting supervisord..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
