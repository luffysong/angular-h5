#!/bin/sh
gulp build:cdn
#rsync -e "ssh -p 22" -rvltOD ./dist/* hanwen@119.254.111.175:~/kr-plus-dev/dist/m
#rsync -e "ssh -p 22" -rvltOD ./dist/* hanwen@119.254.111.175:~/kr-plus/dist/m
rsync -rvltOD ./dist/* dev05:/data/work/asset/m
rsync -rvltOD ./dist/* dev06:/data/work/asset/m
scp ./dist/index.html dev04:/data/work/tomcat_servers/krplus_index/m
