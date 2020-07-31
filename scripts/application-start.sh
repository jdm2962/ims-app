#!/bin/bash
cd /var/www/html/ims-app/api;
sudo pm2 stop index.js
sudo pm2 start index.js;
sudo pm2 startup;
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ec2-user --hp /
