#!/bin/bash

BASEDIR=$(dirname "$0")
cd ${BASEDIR}/../

tsc -p server-tsconfig.json

node server_build/server/Runner.js