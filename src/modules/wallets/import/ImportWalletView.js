/**
 * Import New Wallet
 */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';

import * as Animatable from 'react-native-animatable';

import {
    View,
    KeyboardAvoidingView,
    Text,
    Image,
    TouchableHighlight,
    StyleSheet,
    Keyboard,
} from 'react-native';

// Consts and Libs
import { AppStyles, AppFonts } from '@theme/';

import { Alert, Button, TextInput, Spacer } from '@components/';

import { isValidSeed, getKeyPairsFromSecret } from '@libs/ripple';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    scanIcon: {
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'flex-end',
        backgroundColor: 'rgba(52, 52, 52, 0.5)',
    },
    scanIconImage: {
        tintColor: '#dedfe3',
        width: 25,
        height: 25,
    },
    okIcon: {
        tintColor: '#3DD84C',
        width: 60,
        height: 60,
    },
    buttonText: {
        fontSize: 25,
        color: 'white',
        fontFamily: AppFonts.base.familyBold,
    },
});


/* Component ==================================================================== */
class ImportWalletView extends Component {
    static componentName = 'ImportWalletView';

    static navigatorStyle = {
        navBarTitleTextCentered: false,
        tabBarHidden: true,
        navBarButtonColor: '#FFFFFF',
    };

    constructor(props) {
        super(props);

        this.state = {
            label: null,
            address: null,
            publicKey: null,
            secret: null,
            validSecret: false,
            isLoading: false,
        };
    }

    onSecretChange = secret => {
        if (!isValidSeed(secret)) {
            return this.setState({
                validSecret: false,
            });
        }

        const { publicKey, address } = getKeyPairsFromSecret(secret);

        Keyboard.dismiss();

        return this.setState({
            publicKey,
            secret,
            address,
            validSecret: true,
        });
    };

    handleImportWallet = seed => {
        const { importWallet } = this.props;

        const { label, publicKey, secret, address } = this.state;

        importWallet(seed, {
            label,
            publicKey,
            secret,
            address,
        });

        Alert.show('Your Wallet has been added!', { type: 'success' });

        this.props.navigator.pop();
    };

    onSubmit = () => {
        const { label, secret } = this.state;

        if (!label) {
            return Alert.show('Please Enter A Wallet Name!', { type: 'error' });
        }

        if (!isValidSeed(secret)) {
            return Alert.show('Invalid Ripple Secret!', { type: 'error' });
        }

        this.setState({
            isLoading: true,
        });

        return this.props.navigator.showLightBox({
            screen: 'app.Vault',
            passProps: {
                onOpen: seed => {
                    this.handleImportWallet(seed);
                },
                onDismissed: () => {
                    this.setState({ isLoading: false });
                },
            },
            style: {
                backgroundBlur: 'xlight',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                tapBackgroundToDismiss: true,
            },
        });
    };

    onScannerRead = result => {
        const { data } = result;

        this.props.navigator.dismissModal();

        if (!isValidSeed(data)) {
            return Alert.show('Invalid Secret', { type: 'error' });
        }

        return this.onSecretChange(data);
    };

    showScanner = () => {
        this.props.navigator.showModal({
            screen: 'app.Scanner',
            title: 'Import Wallet',
            passProps: {
                onRead: this.onScannerRead,
            },
        });
    };

    render() {
        const { validSecret, publicKey, address } = this.state;
        return (
            <KeyboardAvoidingView style={[AppStyles.container, AppStyles.padding]}>
                <View style={AppStyles.flex6}>
                    <Text style={AppStyles.subtext}>Name</Text>
                    <Spacer size={10} />
                    <TextInput placeholder="Wallet Name" onChangeText={label => this.setState({ label })} />

                    <Spacer size={40} />

                    <Text style={AppStyles.subtext}>Secret</Text>
                    <Spacer size={10} />
                    <View style={AppStyles.row}>
                        <View style={AppStyles.flex4}>
                            <TextInput
                                value={this.state.secret}
                                placeholder="Enter Secret"
                                onChangeText={this.onSecretChange}
                            />
                        </View>
                        <TouchableHighlight style={styles.scanIcon} onPress={this.showScanner}>
                            <Image
                                source={require('../../../assets/icons/qr__code_coding_scan_qrcode-512.png')}
                                style={styles.scanIconImage}
                            />
                        </TouchableHighlight>
                    </View>
                    <Spacer size={20} />
                    {validSecret && (
                        <View style={[AppStyles.centerAligned]}>
                            <Animatable.Image
                                delay={500}
                                animation="flipInX"
                                style={styles.okIcon}
                                source={require('../../../assets/icons/icons8-ok-100.png')}
                            />
                            <Text style={[AppStyles.p, AppStyles.paddingTopSml]}>Public Key</Text>
                            <Text style={[AppStyles.subtext, AppStyles.textCenterAligned]}>
                                {publicKey}
                            </Text>
                            <Text style={[AppStyles.p, AppStyles.paddingTopSml]}>Address</Text>
                            <Text style={AppStyles.subtext}>{address}</Text>
                        </View>
                    )}
                </View>
                <View style={AppStyles.flex1}>
                    <Button
                        isLoading={this.state.isLoading}
                        isDisabled={!validSecret}
                        style={AppStyles.secondaryButtonStyle}
                        textStyle={styles.buttonText}
                        activeOpacity={1}
                        onPress={this.onSubmit}
                    >
                        Import
                    </Button>
                </View>
            </KeyboardAvoidingView>
        );
    }
}

/* Export Component ==================================================================== */
export default ImportWalletView;
