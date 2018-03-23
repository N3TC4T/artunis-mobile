/* eslint-disable react/forbid-prop-types */
// TODO : FixMe
// @flow

/**
 * Sign Transaction Screen
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Consts and Libs
import { AppStyles, AppColors, AppSizes } from '@theme/';

import { PasswordInput, LoadingIndicator } from '@components/';

import { Vault } from '@libs/vault';
import { Secret } from '@libs/crypto';
import { signTransaction, getKeyPairsFromSeed } from '@libs/ripple';

import * as Animatable from 'react-native-animatable';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    container: {
        width: AppSizes.screen.width * 0.95,
        height: AppSizes.screen.height * 0.35,
        backgroundColor: '#131722',
        borderRadius: 5,
    },
    confirmButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: AppColors.buttonPrimary,
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
    },
});

/* Component ==================================================================== */
class RecipientPickerView extends Component {
    static componentName = 'RecipientPickerView';

    constructor(props) {
        super(props);

        this.state = {
            password: null,
        };
    }

    static navigatorStyle = {
        navBarTitleTextCentered: false,
        tabBarHidden: true,
        navBarButtonColor: '#FFFFFF',
    };

    static propTypes = {
        accountBasics: PropTypes.object.isRequired,
        transaction: PropTypes.object.isRequired,
        onDismissed: PropTypes.func.isRequired,
        onSign: PropTypes.func.isRequired,
    };

    componentWillUnmount() {
        this.props.onDismissed();
    }

    handleSubmit = async () => {
        const { password } = this.state;
        const { accountBasics, transaction } = this.props;

        if (!password) {
            return;
        }

        const seed = await Vault.open('seed', password);
        if (!seed) {
            this.view.shake(800);
        } else {
            let accountSecret = '';
            // Check if account has secret is not then it's Main Wallet
            if (Object.prototype.hasOwnProperty.call(accountBasics, 'secret')) {
                accountSecret = await Secret.decrypt(accountBasics.secret, seed);
            } else {
                const { secret } = getKeyPairsFromSeed(seed);
                accountSecret = secret;
            }

            const signedTransaction = await signTransaction(transaction.txJSON, accountSecret);
            this.props.onSign(signedTransaction);
            this.props.navigator.dismissLightBox();
        }
    };

    render() {
        return (
            <Animatable.View
                ref={element => { this.view = element; }}
                style={[styles.container]}
            >
                <View style={[AppStyles.flex1, AppStyles.padding]}>
                    <Text style={AppStyles.subtext}>
                        Sign the transaction by entering your password. Make sure that the words above match your phrase
                    </Text>
                </View>
                <View style={[AppStyles.flex2, AppStyles.padding]}>
                    <PasswordInput
                        simpleInput
                        placeholder="Enter Password"
                        onChangeText={password => this.setState({ password })}
                    />
                </View>
                <View style={[AppStyles.flex1, AppStyles.row]}>
                    <TouchableOpacity
                        activeOpacity={!this.state.password ? 0.5 : 1}
                        onPress={this.handleSubmit}
                        style={styles.confirmButton}
                    >
                        {this.state.isLoading ? <LoadingIndicator /> : <Text style={AppStyles.baseText}>Confirm</Text>}
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        );
    }
}


/* Export Component ==================================================================== */
export default RecipientPickerView;
