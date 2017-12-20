#!/bin/bash

BASEDIR=$(dirname "$0")
cd ${BASEDIR}/../

pwd

rm -rf ./ios/bundle
mkdir ./ios/bundle

react-native bundle \
--entry-file ./index.ios.js \
--bundle-output ./ios/bundle/index.ios.jsbundle \
--platform ios \
--assets-dest ./ios/bundle \
--dev false