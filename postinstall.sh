#!/usr/bin/env bash

#forcing ripple-lib using WebSocket instead of ws
if [ "$(uname)" == "Darwin" ]; then
    sed -i _backup -E 's=\bws\b=./wswrapper=' "./node_modules/ripple-lib/dist/npm/common/connection.js"
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
    sed -i 's=\bws\b=./wswrapper=' "./node_modules/ripple-lib/dist/npm/common/connection.js"
fi

# fixing RN camera build faild
#if [ -e node_modules/react-native-camera/ios/FaceDetector ] ; then
#  rm -rf node_modules/react-native-camera/ios/FaceDetector
#fi
#cp node_modules/react-native-camera/postinstall_project/projectWithoutFaceDetection.pbxproj node_modules/react-native-camera/ios/RNCamera.xcodeproj/project.pbxproj
