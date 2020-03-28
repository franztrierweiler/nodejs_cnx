#!/bin/bash
TARGET=/home/ubuntu/apps/nodejs_cnx
echo "Déploiement sur $TARGET"
cp app.js $TARGET
cp server.js $TARGET
echo "Fin du déploiement"
