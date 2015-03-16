#!/bin/sh
gulp build:cdn
rsync -e "ssh -p 22" -rvltOD ./dist/* hanwen@119.254.111.175:~/kr-plus-dev/dist/m
rsync -e "ssh -p 22" -rvltOD ./dist/* hanwen@119.254.111.175:~/kr-plus/dist/m
