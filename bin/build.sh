#!/bin/bash

BASEDIR=$(dirname "$0")
cd ${BASEDIR}/../

tsc -p tsconfig.json --watch

cp src/mobile/component/thumbnail_cache/unknown.png ./build/mobile/component/thumbnail_cache