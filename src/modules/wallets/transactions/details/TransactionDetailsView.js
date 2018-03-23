/**
 * Transaction Details Screen
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

import { View, Text, StyleSheet, InteractionManager, ScrollView, Linking } from 'react-native';

// Consts and Libs
import { AppStyles, AppSizes } from '@theme/';

import { QRCode, LoadingIndicator, Toast, Spacer, Error } from '@components/';

import { ErrorMessages } from '@constants/';

import { getTransaction } from '@libs/ripple/';


/* Styles ==================================================================== */
const styles = StyleSheet.create({
    qrCodeContainer: {
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: 'grey',
        alignSelf: 'center',
        alignItems: 'center',
        padding: 10,
        margin: 10,
        backgroundColor: '#fefeff',
    },
    successStatus: {
        color: '#3CC29E',
    },
    failedStatus: {
        color: '#FB6567',
    },
});

/* Component ==================================================================== */
class WalletReceiveView extends Component {
    static componentName = 'WalletReceiveView';

    static navigatorStyle = {
        navBarTitleTextCentered: true,
        tabBarHidden: true,
        navBarButtonColor: '#FFFFFF',
    };

    static navigatorButtons = {
        rightButtons: [
            {
                icon: require('../../../../assets/icons/icons8-open-in-browser-96.png'),
                id: 'openTransaction',
            },
        ],
    };

    static propTypes = {
        txID: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            transaction: null,
            isFetching: true,
            error: null,
        };

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.fetchTransaction();
        });
    }

    onNavigatorEvent(event) {
        if (event.type === 'NavBarButtonPress') {
            if (event.id === 'openTransaction') {
                this.openTxLink();
            }
        }
    }

    openTxLink = () => {
        const { txID } = this.props;
        const url = `https://xrpcharts.ripple.com/#/transactions/${txID}`;
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Toast.show('Can not open link!');
            }
        });
    };

    fetchTransaction = () => {
        const { txID } = this.props;
        this.setState({ isFetching: true, error: null });
        getTransaction(txID)
            .then(res => {
                this.setState({
                    transaction: res,
                    isFetching: false,
                    error: null,
                });
            })
            .catch(() => {
                this.setState({
                    isFetching: false,
                });
            });
    };

    render = () => {
        const { isFetching, transaction, error } = this.state;
        const { txID } = this.props;

        if (isFetching && !transaction) {
            return (
                <View style={[AppStyles.container, AppStyles.containerCentered]}>
                    <LoadingIndicator />

                    <Spacer size={10} />

                    <Text style={AppStyles.h5}>Loading ...</Text>
                </View>
            );
        } else if (!transaction || error) {
            return (
                <View style={[AppStyles.container]}>
                    <Error
                        text={ErrorMessages.transactionNotFound}
                        tryAgain={() => {
                            this.fetchTransaction();
                        }}
                    />
                </View>
            );
        }

        return (
            <ScrollView style={[AppStyles.container, AppStyles.padding]}>
                <View style={AppStyles.flex1}>
                    <View style={styles.qrCodeContainer}>
                        <QRCode
                            text={`https://xrpcharts.ripple.com/#/transactions/${txID}`}
                            width={AppSizes.screen.height / 4}
                            height={AppSizes.screen.height / 4}
                        />
                    </View>
                    <Text style={[AppStyles.baseText, AppStyles.textCenterAligned]}>Transaction Hash</Text>
                    <Text style={[AppStyles.subtext, AppStyles.textCenterAligned]}>{txID}</Text>
                </View>
                <View style={[AppStyles.flex1, AppStyles.paddingVertical]}>
                    <Text style={[AppStyles.baseText]}>Status</Text>

                    {_.get(transaction, ['outcome', 'result']) === 'tesSUCCESS' ? (
                        <Text style={[AppStyles.subtext, styles.successStatus]}>
                            {_.get(transaction, ['outcome', 'result'])}
                        </Text>
                    ) : (
                        <Text style={[AppStyles.subtext, styles.failedStatus]}>
                            {_.get(transaction, ['outcome', 'result'])}
                        </Text>
                    )}

                    <Spacer size={20} />
                    <Text style={[AppStyles.baseText]}>From</Text>
                    <Text style={[AppStyles.subtext]}>
                        {_.get(transaction, ['specification', 'source', 'address'])}
                    </Text>
                    <Spacer size={20} />
                    <Text style={[AppStyles.baseText]}>To</Text>
                    <Text style={[AppStyles.subtext]}>
                        {_.get(transaction, ['specification', 'destination', 'address'])}
                    </Text>
                    {_.get(transaction, ['outcome', 'result']) === 'tesSUCCESS' && (
                        <View>
                            <Spacer size={30} />
                            <Text style={[AppStyles.baseText]}>Amount</Text>
                            <Text style={[AppStyles.subtext]}>
                                {_.get(transaction, ['outcome', 'deliveredAmount', 'value'])} XRP
                            </Text>
                        </View>
                    )}
                    <Spacer size={20} />
                    <Text style={[AppStyles.baseText]}>Fee</Text>
                    <Text style={[AppStyles.subtext]}>{_.get(transaction, ['outcome', 'fee'])} XRP</Text>
                    <Spacer size={20} />
                    <Text style={[AppStyles.baseText]}>Ledger</Text>
                    <Text style={[AppStyles.subtext]}>{_.get(transaction, ['outcome', 'ledgerVersion'])}</Text>
                </View>
            </ScrollView>
        );
    };
}


/* Export Component ==================================================================== */
export default WalletReceiveView;
