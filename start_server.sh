#!/bin/bash
cd /var/www/cndes-calendar
pm2 delete all 2>/dev/null || true
pm2 start ecosystem.config.cjs
pm2 save
pm2 list
echo "--- SERVER STATUS ---"
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3001/api/events
