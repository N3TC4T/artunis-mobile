// @flow
/* eslint-disable no-underscore-dangle,no-undef */
import 'core-js/es6/symbol';
import 'core-js/fn/symbol/iterator';

// react-native
import { YellowBox } from 'react-native';

// Inject node globals into React Native global scope.
if (typeof __dirname === 'undefined') { global.__dirname = '/'; }
if (typeof __filename === 'undefined') { global.__filename = ''; }

global.Buffer = require('buffer').Buffer;
global.process = require('process');

global.process.env.NODE_ENV = __DEV__ ? 'development' : 'production';

global.crypto = {
    // This should be replace with an native module
    getRandomValues(byteArray: Array) {
        for (let i = 0; i < byteArray.length; i++) {
            byteArray[i] = Math.floor(256 * Math.random());
        }
    },
};

YellowBox.disableYellowBox = true;
YellowBox.ignoreWarnings([
    'Setting a timer',
]);
