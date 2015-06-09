#!/bin/sh
gulp build:prod:m1

rsync -rvltOD ./dist/* dev05:/data/work/asset/m1
rsync -rvltOD ./dist/* dev06:/data/work/asset/m1


ssh dev06 'cd /data/work/tomcat_servers/krplus_index/m1;mv index.html index.html.$(date +%Y-%m-%d_%H:%M:%S).bak;exit;'
scp ./dist/index.html dev06:/data/work/tomcat_servers/krplus_index/m1


rsync -rvltOD ./dist/* dev06:/data/work/frontend/prod/36kr/krplus/dist/m1
rsync -rvltOD ./dist/* dev05:/data/work/frontend/prod/36kr/krplus/dist/m1

