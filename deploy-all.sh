#!/bin/bash

./deploy.sh;
scp ./public/ikea-clean-deduped.js root@sam-watkinson.com:/var/www/meatball/public/ikea-clean-deduped.js;
scp ./public/three.js root@sam-watkinson.com:/var/www/meatball/public/three.js;
scp ./public/image.png root@sam-watkinson.com:/var/www/meatball/public/image.png;