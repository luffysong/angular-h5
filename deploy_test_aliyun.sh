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
elif [ $2 = 'test05' ]; then
    target=test5;
elif [ $2 = 'test06' ]; then
    target=test6;
elif [ $2 = 'test07' ]; then
    target=test7;
elif [ $2 = 'test08' ]; then
    target=test8;
elif [ $2 = 'test09' ]; then
    target=test9;
elif [ $2 = 'test10' ]; then
    target=test10;
elif [ $2 = 'test11' ]; then
    target=test11;
elif [ $2 = 'test12' ]; then
    target=test12;
elif [ $2 = 'test19' ]; then
    target=test19;
fi

gulp build:$target

rsync -rvltOD ./dist/* "www@ali-rong-$1:/data/docker/$2/work/frontend/prod/36kr/krplus/dist/m"



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
