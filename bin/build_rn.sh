#!/bin/bash

BASEDIR=$(dirname "$0")
cd ${BASEDIR}/../src/mobile/

tsc -p tsconfig.json --watch