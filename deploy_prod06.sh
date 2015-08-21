#!/bin/sh
gulp build:prod

rsync -rvltOD ./dist/* dev05:/data/work/asset/m
rsync -rvltOD ./dist/* dev06:/data/work/asset/m

#ssh dev05 'cd /data/work/frontend/prod/36kr/krplus;tar zcf m$(date +%Y%m%d%H%M%S).tar.gz dist/m/;exit;'
#rsync -rvltOD ./dist/* dev05:/data/work/frontend/prod/36kr/krplus/dist/m


ssh dev06 'cd /data/work/frontend/prod/36kr/krplus;tar zcf m$(date +%Y%m%d%H%M%S).tar.gz dist/m/;exit;'
rsync -rvltOD ./dist/* dev06:/data/work/frontend/prod/36kr/krplus/dist/m
