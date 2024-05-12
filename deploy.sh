#!/bin/sh

echo "Switching to branch master"
git checkout master

echo "Building app"
npm run build:site

echo "Deploying files to server"
# rsync -avP dist/ root@45.33.31.71:/var/www/45.33.31.71
rsync -avP dist/ root@176.58.127.136:/var/www/sorcerer.livewirre.com
echo "Deployment complete"
