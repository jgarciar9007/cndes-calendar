# Automation Script for CNDES Calendar Deployment
# Usage: powershell -File deploy_to_prod.ps1

$SERVER_IP = "192.168.20.9"
$DEST_DIR = "/var/www/cndes-calendar"

Write-Host "Building frontend..." -ForegroundColor Cyan
npm run build

Write-Host "Packaging application..." -ForegroundColor Cyan
if (Test-Path deploy.tar.gz) { Remove-Item deploy.tar.gz }
tar -czf deploy.tar.gz dist server/index.js server/db.js server/ai.service.js server/package.json server/.env package.json ecosystem.config.cjs

Write-Host "Uploading to $SERVER_IP..." -ForegroundColor Cyan
scp deploy.tar.gz "root@${SERVER_IP}:${DEST_DIR}/"

Write-Host "Deploying and Cleaning on remote server..." -ForegroundColor Cyan
# This command moves the tarball, cleans the directory (except uploads), and redeploys
$REMOTE_CMD = "cd $DEST_DIR && mv deploy.tar.gz .. && find . -maxdepth 1 ! -name 'uploads' ! -name '.' -exec rm -rf {} + && mv ../deploy.tar.gz . && tar -xzf deploy.tar.gz && cd server && npm install && cd .. && pm2 restart ecosystem.config.cjs || pm2 start ecosystem.config.cjs && pm2 save"

ssh "root@$SERVER_IP" $REMOTE_CMD

Write-Host "Deployment finished successfully!" -ForegroundColor Green
