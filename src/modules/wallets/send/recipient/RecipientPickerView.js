// @flow

/**
 * Choose Recipient Screen
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { View, StyleSheet, Image, Clipboard } from 'react-native';

import Camera from 'react-native-camera';

// Consts and Libs
import { AppStyles } from '@theme/';

import { Toast, ActionButton } from '@components/';

import { isValidAddress } from '@libs/ripple';


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
class RecipientPickerView extends Component {
    static componentName = 'RecipientPickerView';

    static navigatorStyle = {
        navBarTitleTextCentered: false,
        tabBarHidden: true,
        navBarButtonColor: '#FFFFFF',
    };

    static propTypes = {
        onSelect: PropTypes.func.isRequired,
    };

    showContactPicker = () => {
        const { contacts } = this.props;
        this.props.navigator.showModal({
            screen: 'app.Picker',
            title: 'Choose Contact',
            passProps: {
                onSelect: this.onSelect,
                items: contacts,
                type: 'contact',
            },
        });
    };

    onSelect = (data: string) => {
        if (isValidAddress(data.address)) {
            // Todo: bug
            // Vibration.vibrate();
            this.props.onSelect(data);
            this.props.navigator.pop({
                animationType: 'fade',
            });
        } else {
            Toast.show(`Invalid Address: ${data}`);
        }
    };

    onBarCodeRead = (result: { data: string }) => {
        const { data } = result;
        this.onSelect({ address: data });
    };

    onClipboardRead = async () => {
        const content = await Clipboard.getString();
        this.onSelect({ address: content });
    };

    render() {
        return (
            <View style={[AppStyles.container]}>
                <View style={AppStyles.flex3}>
                    <Camera
                        style={styles.preview}
                        onBarCodeRead={this.onBarCodeRead}
                        captureAudio={false}
                        permissionDialogTitle="Permission to use camera"
                        permissionDialogMessage="We need your permission to use your camera phone"
                    >
                        <View style={styles.rectangleContainer}>
                            <Image
                                source={require('../../../../assets/images/qr-scanner.png')}
                                style={styles.rectangle}
                            />
                        </View>
                    </Camera>
                </View>
                <View style={[AppStyles.flex1, AppStyles.padding]}>
                    <ActionButton onPress={this.showContactPicker} label="Choose from contacts" icon="contacts" />
                    <ActionButton onPress={this.onClipboardRead} label="Use Address From Clipboard" icon="clipboard" />
                </View>
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default RecipientPickerView;
