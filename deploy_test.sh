#!/bin/sh
gulp build:test
rsync -rvltOD ./dist/* dev03:/data/work/frontend/test/36kr/krplus/dist/m

