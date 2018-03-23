// @flow

/**
 * Scan Screen
 */

import has from 'lodash/has';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { View, StyleSheet, Image } from 'react-native';

import Camera from 'react-native-camera';

// Consts and Libs
import { AppStyles } from '@theme/';

import { isValidAddress } from '@libs/ripple';

/* eslint-disable no-useless-escape */
const URL_REGEX = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;


/* Styles ==================================================================== */
const styles = StyleSheet.create({
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    rectangleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    rectangle: {
        height: 300,
        width: 300,
        opacity: 0.5,
        backgroundColor: 'transparent',
    },
});

/* Component ==================================================================== */
class ScanView extends Component {
    static componentName = 'ScanView';

    static navigatorStyle = {
        navBarTitleTextCentered: false,
        tabBarHidden: true,
        navBarButtonColor: '#FFFFFF',
    };

    static propTypes = {
        setScanResult: PropTypes.func.isRequired,
    };

    getURLParams = entry => {
        const vars = {};
        entry.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => {
            vars[key] = value;
        });
        return vars;
    };

    onFinishScan = (data) => {
        const { navigator, setScanResult } = this.props;

        setScanResult(data);

        navigator.switchToTab({ tabIndex: 2 });
        navigator.dismissModal();
    }

    onBarCodeRead = (result: { data: string }) => {
        const { data } = result;

        if (URL_REGEX.test(data)) {
            const params = this.getURLParams(data);
            if (has(params, 'to') && has(params, 'amount')) {
                if (!isValidAddress(params.to)) {
                    return null;
                }
                return this.onFinishScan({
                    type: 'uri',
                    recipient: { address: params.to },
                    amount: params.amount,
                });
            }
        } else if (isValidAddress(data)) {
            return this.onFinishScan({
                type: 'address',
                recipient: { address: data },
                amount: '0',
            });
        }

        return null;
    };

    render() {
        return (
            <View style={[AppStyles.container]}>
                <View style={AppStyles.flex1}>
                    <Camera
                        style={styles.preview}
                        onBarCodeRead={this.onBarCodeRead}
                        captureAudio={false}
                        permissionDialogTitle="Permission to use camera"
                        permissionDialogMessage="We need your permission to use your camera phone"
                    >
                        <View style={styles.rectangleContainer}>
                            <Image source={require('../../assets/images/qr-scanner.png')} style={styles.rectangle} />
                        </View>
                    </Camera>
                </View>
            </View>
        );
    }
}


/* Export Component ==================================================================== */
export default ScanView;
