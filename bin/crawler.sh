#!/bin/bash

BASEDIR=$(dirname "$0")
cd ${BASEDIR}/../

tsc -p server-tsconfig.json

node build/server/Runner.js