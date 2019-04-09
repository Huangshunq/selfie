#!/usr/bin/pm2
pm2 delete selfie-backend
NODE_ENV=production pm2 start app.js --name selfie-backend
pm2 startup
pm2 save
