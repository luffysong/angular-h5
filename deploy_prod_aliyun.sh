#!/bin/bash

gulp build:prod

####### CDN
cdnstr="/data/work/asset/m"
#site1
rsync -rvltOD ./dist/* ali-rong-proxy-01:$cdnstr
rsync -rvltOD ./dist/* ali-rong-php-01:$cdnstr
rsync -rvltOD ./dist/* ali-rong-tomcat-01:$cdnstr
rsync -rvltOD ./dist/* ali-rong-api-01:$cdnstr

#site2
rsync -rvltOD ./dist/* ali-rong-proxy-02:$cdnstr
rsync -rvltOD ./dist/* ali-rong-php-02:$cdnstr
rsync -rvltOD ./dist/* ali-rong-tomcat-02:$cdnstr
rsync -rvltOD ./dist/* ali-rong-api-02:$cdnstr


###### 业务逻辑
pathstr="/data/work/frontend/prod/36kr/krplus/dist/m"
if [ $1 = 'site1' ]; then
    rsync -rvltOD ./dist/* ali-rong-proxy-01:$pathstr
    rsync -rvltOD ./dist/* ali-rong-php-01:$pathstr
    rsync -rvltOD ./dist/* ali-rong-tomcat-01:$pathstr
    rsync -rvltOD ./dist/* ali-rong-api-01:$pathstr
elif [ $1 = 'site2' ]; then
    rsync -rvltOD ./dist/* ali-rong-proxy-02:$pathstr
    rsync -rvltOD ./dist/* ali-rong-php-02:$pathstr
    rsync -rvltOD ./dist/* ali-rong-tomcat-02:$pathstr
    rsync -rvltOD ./dist/* ali-rong-api-02:$pathstr
elif [ $1 = 'all' ]; then
    rsync -rvltOD ./dist/* ali-rong-proxy-01:$pathstr
    rsync -rvltOD ./dist/* ali-rong-php-01:$pathstr
    rsync -rvltOD ./dist/* ali-rong-tomcat-01:$pathstr
    rsync -rvltOD ./dist/* ali-rong-api-01:$pathstr
    rsync -rvltOD ./dist/* ali-rong-proxy-02:$pathstr
    rsync -rvltOD ./dist/* ali-rong-php-02:$pathstr
    rsync -rvltOD ./dist/* ali-rong-tomcat-02:$pathstr
    rsync -rvltOD ./dist/* ali-rong-api-02:$pathstr
elif [ $1 = 'sim' ]; then
    rsync -rvltOD ./dist/* ali-rong-sim-01:$pathstr
elif [ $1 = 'alpha' ]; then
    rsync -rvltOD ./dist/* ali-rong-alpha-01:$pathstr
fi






#gulp build:prod
#rsync -rvltOD ./dist/* dev05:/data/work/asset/m
#rsync -rvltOD ./dist/* dev06:/data/work/asset/m
#
#oldIFS="$IFS"
#IFS="&"
#arr=("$1")
#for i in ${arr[@]}
#do
#ssh dev${i} 'cd /data/work/frontend/prod/36kr/krplus;tar zcf m$(date +%Y%m%d%H%M%S).tar.gz dist/m/;exit;'
#rsync -rvltOD ./dist/* dev${i}:/data/work/frontend/prod/36kr/krplus/dist/m
#done;
#IFS="$oldIFS"
