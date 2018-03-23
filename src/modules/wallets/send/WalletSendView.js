/* eslint-disable react/forbid-prop-types */
// TODO: FixMe
// @flow

/**
 * Home Screen
 *  - Shows total balance and navigation's
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

import { View, Text, StyleSheet, KeyboardAvoidingView } from 'react-native';

// Consts and Libs
import { AppStyles, AppFonts } from '@theme/';
import { preparePayment } from '@libs/ripple';

import { Spacer, Alert, TextInput, Button, PickerButton } from '@components/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    buttonText: {
        fontSize: 25,
        color: 'white',
        fontFamily: AppFonts.base.familyBold,
    },
});


/* Component ==================================================================== */
class WalletSendView extends Component {
    static componentName = 'WalletSendView';

    static navigatorStyle = {
        navBarButtonColor: '#FFFFFF',
    };

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            account: _.values(props.accounts)[0],
            recipient: null,
            amount: null,
            amountInUSD: 0,
        };
    }

    static propTypes = {
        coreConfig: PropTypes.object.isRequired,
        accounts: PropTypes.object.isRequired,
        market: PropTypes.object.isRequired,
        scanResult: PropTypes.object,
    };

    componentWillReceiveProps(nextProps) {
        const { account } = this.state;
        const { accounts, scanResult } = nextProps;
        if (_.isUndefined(account)) {
            return;
        }
        if (!_.isEqual(_.get(accounts, account.address), account)) {
            this.setState({
                account: _.get(accounts, account.address),
            });
        }

        if (Object.prototype.hasOwnProperty.call(scanResult, 'type')) {
            this.setState({
                recipient: { ...this.state.recipient, ...scanResult.recipient },
            });
            this.onChangeAmount(scanResult.amount);
        }
    }

    showRecipientPicker = () => {
        this.props.navigator.push({
            screen: 'app.WalletSend.RecipientPicker',
            title: 'Choose Recipient',
            animationType: 'fade',
            passProps: {
                onSelect: recipient => {
                    this.setState({ recipient });
                },
            },
        });
    };

    showAccountPicker = () => {
        const { accounts } = this.props;
        this.props.navigator.showModal({
            screen: 'app.Picker',
            title: 'Choose Account',
            animationType: 'fade',
            passProps: {
                onSelect: account => {
                    this.setState({ account });
                },
                items: accounts,
            },
        });
    };

    onChangeAmount = (data: string) => {
        const { market } = this.props;
        const amount = data.replace(/[^(\d+)(\d+)]/g, '');
        this.setState({
            amount,
            amountInUSD: amount * market.currentPrice,
        });
    };

    onChangeDestinationTag = (data: string) => {
        const destinationTag = data.replace(/[^(\d+)(\d+)]/g, '');
        this.setState({ recipient: { ...this.state.recipient, destinationTag } });
    };

    handleSignRequest = () => {
        const { coreConfig } = this.props;
        const { account, recipient, amount } = this.state;

        this.setState({
            isLoading: true,
        });

        const instructions = {
            maxLedgerVersionOffset: coreConfig.maxLedgerVersionOffset,
            maxFee: coreConfig.maxFee,
        };

        this.payment = {
            source: {
                address: account.address,
                maxAmount: {
                    value: amount,
                    currency: 'XRP',
                },
            },
            destination: {
                address: recipient.address,
                tag: recipient.destinationTag || undefined,
                amount: {
                    value: amount,
                    currency: 'XRP',
                },
            },
        };

        preparePayment(this.payment, instructions).then(
            preparedTransaction => {
                this.props.navigator.showLightBox({
                    screen: 'app.WalletSend.SignTransaction',
                    passProps: {
                        account,
                        transaction: preparedTransaction,
                        onSign: signedTransaction => {
                            this.handleConfirmRequest(signedTransaction);
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
            },
            error => {
                Alert.show('Can not make transaction , something is wrong!', { type: 'error' });
                this.setState({
                    isLoading: false,
                });
                console.warn(error);
            },
        );
    };

    handleConfirmRequest = SignedTransaction => {
        const { account, recipient, amount } = this.state;

        this.props.navigator.push({
            screen: 'app.WalletSend.ConfirmSend',
            title: 'Confirm Send',
            animationType: 'fade',
            passProps: {
                SignedTransaction,
                Payment: {
                    from: account.label,
                    to: recipient.name || recipient.address,
                    amount,
                },
            },
        });
    };

    render() {
        const { account, recipient, amount } = this.state;
        if (!account) {
            return null;
        }
        return (
            <KeyboardAvoidingView style={[AppStyles.container, AppStyles.padding]}>
                <View style={AppStyles.flex5}>
                    <Text style={AppStyles.subtext}>Recipient</Text>
                    <Spacer size={10} />
                    <PickerButton onPress={this.showRecipientPicker}>
                        {recipient ? (
                            <Text numberOfLines={1} style={[AppStyles.baseText, AppStyles.paddingVerticalSml]}>
                                {recipient.name} {recipient.address}
                            </Text>
                        ) : (
                            <Text style={[AppStyles.subtext, AppStyles.paddingVerticalSml]}>Choose recipient...</Text>
                        )}
                    </PickerButton>
                    {!!recipient && (
                        <TextInput
                            keyboardType="numeric"
                            placeholder="Destination Tag (optional)"
                            onChangeText={text => this.onChangeDestinationTag(text)}
                            value={this.state.recipient.destinationTag}
                        />
                    )}
                    <Spacer size={30} />
                    <Text style={AppStyles.subtext}>Amount</Text>
                    <Spacer size={10} />
                    <PickerButton onPress={this.showAccountPicker}>
                        <Text style={AppStyles.baseText}>{account.label}</Text>
                        <Text style={[AppStyles.subtext]}>{account.balance.toFixed(2)} XRP</Text>
                    </PickerButton>
                    <TextInput
                        keyboardType="numeric"
                        placeholder="Specify Amount"
                        onChangeText={text => this.onChangeAmount(text)}
                        value={amount}
                    />
                    <Spacer size={5} />
                    <Text style={[AppStyles.subtext, AppStyles.textRightAligned]}>
                        = {this.state.amountInUSD.toFixed(2)} USD
                    </Text>
                </View>
                <View style={AppStyles.flex1}>
                    <Button
                        isLoading={this.state.isLoading}
                        isDisabled={!recipient || !amount || amount > account.balance}
                        style={AppStyles.secondaryButtonStyle}
                        textStyle={styles.buttonText}
                        activeOpacity={1}
                        onPress={this.handleSignRequest}
                    >
                        Sign Transaction
                    </Button>
                </View>
            </KeyboardAvoidingView>
        );
    }
}

/* Export Component ==================================================================== */
export default WalletSendView;
