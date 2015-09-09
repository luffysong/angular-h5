#!/bin/bash
gulp build:prod
rsync -rvltOD ./dist/* dev05:/data/work/asset/m
rsync -rvltOD ./dist/* dev06:/data/work/asset/m

oldIFS="$IFS"
IFS="&"
arr=("$1")
for i in ${arr[@]}
do
ssh dev${i} 'cd /data/work/frontend/prod/36kr/krplus;tar zcf m$(date +%Y%m%d%H%M%S).tar.gz dist/m/;exit;'
rsync -rvltOD ./dist/* dev${i}:/data/work/frontend/prod/36kr/krplus/dist/m
done;
IFS="$oldIFS"