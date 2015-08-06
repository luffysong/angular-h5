#!/bin/sh
gulp build:test
rsync -rvltOD ./dist/* dev03:/data/work/frontend/test4/36kr/krplus/dist/m

