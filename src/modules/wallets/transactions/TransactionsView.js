/**
 * Transactions Listing Screen
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

import { View, Text, TouchableHighlight, StyleSheet, FlatList, InteractionManager } from 'react-native';

// Consts and Libs
import { AppStyles, AppColors } from '@theme/';

import { LoadingIndicator, Spacer, Error } from '@components/';
import { ErrorMessages } from '@constants/';

import { getTransactions } from '@libs/ripple';
import { Truncate } from '@libs/utils';

let BOTTOM_BORDER_COLOR = '#3CC29E';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.background,
    },
    rowContainer: {
        padding: 16,
        paddingLeft: 20,
        paddingRight: 20,
        justifyContent: 'space-between',
        borderBottomWidth: 0.5,
    },
    rowContent: {
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    labelTextWrap: {
        justifyContent: 'center',
    },
    incomeAmount: {
        color: '#3CC29E',
    },
    outcomeAmount: {
        color: '#FB6567',
    },
    addressLabel: {
        fontSize: 17,
    },
});

/* Component ==================================================================== */
class WalletReceiveView extends Component {
    static componentName = 'WalletReceiveView';

    static navigatorStyle = {
        navBarTitleTextCentered: false,
        tabBarHidden: true,
        navBarButtonColor: '#FFFFFF',
    };

    static navigatorButtons = {
        rightButtons: [
            {
                icon: require('../../../assets/icons/icons8-slider-100.png'),
                disabled: true,
                id: 'saveContact',
            },
        ],
    };

    static propTypes = {
        account: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            transactions: [],
            isRefreshing: true,
            isLoadingMore: false,
            error: null,
        };
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.fetchTransactions();
        });
    }

    fetchTransactions = () => {
        const { account } = this.props;
        this.setState({ isRefreshing: true, error: null });
        getTransactions(account, {})
            .then(res => {
                this.setState({
                    transactions: _.uniqBy([...this.state.transactions, ...res], 'id'),
                    isRefreshing: false,
                    error: null,
                });
            })
            .catch(() => {
                this.setState({
                    isRefreshing: false,
                });
            });
    };

    LoadMore = () => {
        const { isLoadingMore, transactions } = this.state;
        const { account } = this.props;

        if (isLoadingMore) {
            return;
        }
        this.setState({ isLoadingMore: true });

        const startFrom = transactions[transactions.length - 1].id;

        getTransactions(account, { start: startFrom })
            .then(res => {
                this.setState({
                    transactions: _.uniqBy([...this.state.transactions, ...res], 'id'),
                    isLoadingMore: false,
                });
            })
            .catch(err => {
                console.warn(err);
                this.setState({
                    isLoadingMore: false,
                });
            });
    };

    onItemClick = id => {
        this.props.navigator.showModal({
            screen: 'app.TransactionDetails',
            title: 'Transaction Details',
            animationType: 'fade',
            passProps: {
                txID: id,
            },
        });
    };

    renderItem = obj => {
        const tx = obj.item;
        const { account } = this.props;
        let balanceChange = null;

        const destination = _.get(tx, ['specification', 'destination']);
        const info = _.get(tx, ['outcome']);
        // const source = _.get(tx, ['specification', 'source']);

        if (account !== destination.address) {
            // Outcome Transaction
            const amount = _.get(info, ['balanceChanges', account, '0', 'value']);
            balanceChange = (
                <Text style={[AppStyles.h5, styles.outcomeAmount]}>
                    {amount} <Text style={[AppStyles.subtext]}>XRP</Text>
                </Text>
            );
            BOTTOM_BORDER_COLOR = 'rgba(192,40,39, 0.4)';
        } else {
            // Income Transaction
            const amount = _.get(info, ['balanceChanges', destination.address, '0', 'value']);
            balanceChange = (
                <Text style={[AppStyles.h5, styles.incomeAmount]}>
                    +{amount} <Text style={[AppStyles.subtext]}>XRP</Text>
                </Text>
            );
            BOTTOM_BORDER_COLOR = 'rgba(59,105,118, 0.4)';
        }

        return (
            <View>
                <TouchableHighlight
                    style={[styles.rowContainer, { borderBottomColor: BOTTOM_BORDER_COLOR }]}
                    onPress={() => {
                        this.onItemClick(tx.id);
                    }}
                >
                    <View style={styles.rowContent}>
                        <View style={styles.labelTextWrap}>
                            <Text style={[AppStyles.baseText, styles.addressLabel]}>{Truncate(tx.address, 30)}</Text>
                            <Text style={[AppStyles.subtext, AppStyles.textLeftAligned]}>
                                {info.timestamp}
                            </Text>
                        </View>
                        <View style={styles.labelTextWrap}>{balanceChange}</View>
                    </View>
                </TouchableHighlight>
            </View>
        );
    };

    render = () => {
        const { isRefreshing, isLoadingMore, transactions, error } = this.state;

        if (isRefreshing) {
            if (transactions.length < 1) {
                return (
                    <View style={[AppStyles.container, AppStyles.containerCentered]}>
                        <LoadingIndicator />

                        <Spacer size={10} />

                        <Text style={AppStyles.h5}>Loading ...</Text>
                    </View>
                );
            }
        }

        // show alert on empty transactions
        if (!isRefreshing) {
            if (!transactions || transactions.length < 1 || error) {
                return (
                    <View style={[AppStyles.container]}>
                        <Error
                            text={ErrorMessages.transactions404}
                            tryAgain={() => {
                                this.fetchTransactions();
                            }}
                        />
                    </View>
                );
            }
        }

        return (
            <View style={[styles.container]}>
                <FlatList
                    renderItem={transaction => this.renderItem(transaction)}
                    data={transactions}
                    refreshing={isRefreshing}
                    onRefresh={() => {
                        this.fetchTransactions();
                    }}
                    // onEndReached={this.LoadMore} //TODO: FIX ME
                    keyExtractor={item => item.id}
                    ListFooterComponent={() => isLoadingMore && <LoadingIndicator />}
                />
            </View>
        );
    };
}


/* Export Component ==================================================================== */
export default WalletReceiveView;
