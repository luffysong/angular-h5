#!/bin/bash

# $1 - docker-01 docker02
# $2 - test01 test02


if [ $2 = 'test01' ]; then
    target=test;
elif [ $2 = 'test02' ]; then
    target=test2;
elif [ $2 = 'test03' ]; then
    target=test3;
elif [ $2 = 'test04' ]; then
    target=test4;
fi

gulp build:$target

rsync -rvltOD ./dist/* "ali-rong-$1:/data/docker/$2/work/frontend/prod/36kr/krplus/dist/m"



#target=${1:7}
#gulp build:$target
#if [ $target = 'test' ] || [ $target = 'test4' ] || [ $target = 'test6' ]; then
#  server='03'
#elif [ $target = 'test2' ] || [ $target = 'test3' ]; then
#  server='02'
#elif [ $target = 'dev' ]; then
#  server='04'
#fi
#rsync -rvltOD ./dist/* "dev$server:/data/work/frontend/$target/36kr/krplus/dist/m"

