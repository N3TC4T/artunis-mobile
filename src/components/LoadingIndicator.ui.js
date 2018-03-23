/* eslint-disable react-native/no-inline-styles, react/no-typos */
// Todo: FixMe
// @flow

import React from 'react';
import { ActivityIndicator, ViewPropTypes } from 'react-native';

const LoadingIndicator = () => (
    <ActivityIndicator size="small" animating color="#fefeff" style={{ paddingVertical: 5 }} />
);

LoadingIndicator.propTypes = {
    style: ViewPropTypes.style,
};

export default LoadingIndicator;
