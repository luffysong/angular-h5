#!/bin/sh
rsync -e "ssh -p 22" -rvltOD ./* hanwen@119.254.111.175:~/kr-plus-h5-dev
