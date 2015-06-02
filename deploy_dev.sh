#!/bin/sh
gulp build:dev
rsync -rvltOD ./dist/* dev04:/data/work/frontend/dev/36kr/krplus/dist/m
