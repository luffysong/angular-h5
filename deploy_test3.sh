#!/bin/sh
gulp build:test
rsync -rvltOD ./dist/* dev02:/data/work/frontend/test3/36kr/krplus/dist/m

