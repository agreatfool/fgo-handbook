#!/bin/bash

BASEDIR=$(dirname "$0")
cd ${BASEDIR}/../

pwd

rm -rf ${BASEDIR}/ios/bundle
mkdir ${BASEDIR}/ios/bundle

react-native bundle \
--entry-file ${BASEDIR}/index.ios.js \
--bundle-output ${BASEDIR}/ios/bundle/index.ios.jsbundle \
--platform ios \
--assets-dest ${BASEDIR}/ios/bundle \
--dev false