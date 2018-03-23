import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Image } from 'react-native';

import Camera from 'react-native-camera';

import { AppStyles, AppColors } from '@theme/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: AppColors.background,
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
class Scanner extends Component {
    static componentName = 'Scanner';

    static navigatorStyle = {
        navBarTitleTextCentered: false,
    };

    static propTypes = {
        onRead: PropTypes.func.isRequired,
    };

    render() {
        return (
            <View style={[AppStyles.container]}>
                <Camera
                    style={styles.preview}
                    onBarCodeRead={this.props.onRead}
                    captureAudio={false}
                    permissionDialogTitle="Permission to use camera"
                    permissionDialogMessage="We need your permission to use your camera phone"
                >
                    <View style={styles.rectangleContainer}>
                        <Image source={require('../../assets/images/qr-scanner.png')} style={styles.rectangle} />
                    </View>
                </Camera>
            </View>
        );
    }
}


export default Scanner;
