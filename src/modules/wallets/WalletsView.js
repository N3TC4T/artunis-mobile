/* eslint-disable react/forbid-prop-types */
// TODO: FixMe
/**
 * Wallets List Screen
 *  - Shows total balance and navigation's
 */
import _ from 'lodash';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Animatable from 'react-native-animatable';

import {
    View,
    Alert,
    Text,
    TouchableHighlight,
    StyleSheet,
    Image,
    ImageBackground,
} from 'react-native';

// Libs
import { AppStyles, AppColors, AppSizes } from '@theme/';

import { Spacer } from '@components/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.background,
    },
    headerContainer: {
        flex: 3,
        backgroundColor: '#0000',
    },
    headerImageBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // contentHeaderContainer: {
    //     flex: 1,
    //     paddingHorizontal: 5,
    //     justifyContent: 'center',
    //     backgroundColor: '#364150',
    // },
    contentContainer: {
        flex: 6,
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#364150',
        marginHorizontal: 20,
    },
    rowContainer: {
        padding: 16,
        paddingLeft: 20,
        paddingRight: 20,
        justifyContent: 'space-between',
    },
    rowContent: {
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    labelTextWrap: {
        justifyContent: 'center',
    },
    labelTextRight: {
        fontSize: 15,
        textAlign: 'right',
    },
    percentChangeText: {
        fontSize: 15,
        color: '#fefeff',
    },
    percentChangeUp: {
        height: 18,
        top: 3,
        paddingHorizontal: 5,
        borderRadius: 20,
        backgroundColor: '#a8f3d4',
    },
    percentChangeDown: {
        height: 18,
        top: 3,
        paddingHorizontal: 5,
        borderRadius: 20,
        backgroundColor: '#FA6E59',
    },
    actionBarText: {
        fontSize: 20,
        paddingLeft: 7,
    },
    actionBarIcon: {
        tintColor: '#364150',
        width: 28,
        height: 28,
    },
    actionBarPlusIcon: {
        tintColor: '#0896d6',
        width: 25,
        height: 25,
    },
});

/* Component ==================================================================== */
class WalletsView extends Component {
    static componentName = 'MainView';

    static navigatorStyle = {
        drawUnderNavBar: true,
        navBarTransparent: true,
        topBarElevationShadowEnabled: false,
        navBarNoBorder: true,
    };

    static propTypes = {
        accounts: PropTypes.object.isRequired,
        totalBalance: PropTypes.number.isRequired,
        market: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.totalBalance !== nextProps.totalBalance) {
            return true;
        }
        return this.props.accounts !== nextProps.accounts;
    }

    componentDidUpdate() {
        if (this.TextChangeRef && this.TextBalanceRef) {
            this.TextChangeRef.startAnimation(1000, 0, () => {});
            this.TextBalanceRef.startAnimation(2000, 0, () => {});
        }
    }

    componentDidMount() {
        Alert.alert(
            'Warning',
            'The app by default running on XRP Test Network, Please DO NOT send real XRP to the wallets'
        );
    }

    onNavigatorEvent(event) {
        if (event.type === 'NavBarButtonPress') {
            if (event.id === 'menu') {
                this.props.navigator.toggleDrawer({
                    side: 'right',
                    animated: true,
                    to: 'open',
                });
            }
            if (event.id === 'scan') {
                this.props.navigator.showModal({
                    screen: 'app.Scan',
                    title: 'Scan',
                    animated: true,
                });
            }
        }
    }

    renderHeaderContent = () => {
        const { totalBalance, market } = this.props;
        return (
            <View style={[styles.headerContainer]}>
                <ImageBackground
                    source={require('../../assets/images/header.png')}
                    style={styles.headerImageBackground}
                >
                    <View style={[AppStyles.row, { marginTop: AppSizes.screen.height * 0.1 }]}>
                        <View style={[AppStyles.flex1, AppStyles.centerAligned]}>
                            <Animatable.Text
                                ref={component => {
                                    this.TextBalanceRef = component;
                                }}
                                animation="fadeIn"
                                style={[AppStyles.h1]}
                            >
                                {totalBalance ? totalBalance.toFixed(2) : '0'} USD
                            </Animatable.Text>
                        </View>
                    </View>
                    <View style={[AppStyles.row]}>
                        <View style={[AppStyles.flex1, AppStyles.centerAligned]}>
                            <View style={[AppStyles.row, AppStyles.centerAligned]}>
                                <Text style={[AppStyles.subtext]}>24h Change: </Text>
                                {market.priceDirection === 'up' ? (
                                    <View style={[styles.percentChangeUp, AppStyles.centerAligned]}>
                                        <Animatable.Text
                                            ref={component => {
                                                this.TextChangeRef = component;
                                            }}
                                            animation="fadeIn"
                                            style={[AppStyles.subtext, styles.percentChangeText]}
                                        >
                                            + {market.percentChange}
                                        </Animatable.Text>
                                    </View>
                                ) : (
                                    <View style={[styles.percentChangeDown, AppStyles.centerAligned]}>
                                        <Animatable.Text
                                            ref={component => {
                                                this.TextChangeRef = component;
                                            }}
                                            animation="fadeIn"
                                            style={[AppStyles.subtext, styles.percentChangeText]}
                                        >
                                            {market.percentChange}
                                        </Animatable.Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                    <Spacer size={20} />
                </ImageBackground>
            </View>
        );
    };

    renderListHeader = () => (
        <View style={[AppStyles.row, AppStyles.padding]}>
            <View style={[AppStyles.row, AppStyles.centerAligned]}>
                <Image source={require('../../assets/icons/icons8-wallet-96.png')} style={styles.actionBarIcon} />
                <Text style={[AppStyles.baseText, styles.actionBarText]}>Wallets</Text>
            </View>

            <View style={[AppStyles.flex1, AppStyles.rightAligned]}>
                <TouchableHighlight
                    onPress={() => {
                        this.props.navigator.push({
                            screen: 'app.ImportWallet',
                            title: 'Import Wallet',
                            animationType: 'fade',
                        });
                    }}
                >
                    <Image
                        source={require('../../assets/icons/icons8-plus-math-64.png')}
                        style={styles.actionBarPlusIcon}
                    />
                </TouchableHighlight>
            </View>
        </View>
    );

    renderRow = (account, id) => (
        <View key={id}>
            <TouchableHighlight
                style={styles.rowContainer}
                onPress={() => {
                    this.props.navigator.push({
                        screen: 'app.WalletTransactions',
                        title: 'Transactions',
                        animationType: 'fade',
                        passProps: {
                            account: id,
                        },
                    });
                }}
            >
                <View style={styles.rowContent}>
                    <View style={styles.labelTextWrap}>
                        <Text style={AppStyles.baseText}>{account.label}</Text>
                    </View>
                    <View style={styles.labelTextWrap}>
                        <Text style={AppStyles.h5}>{account.balance.toFixed(2)}</Text>
                        <Text style={[AppStyles.subtext, styles.labelTextRight]}>XRP</Text>
                    </View>
                </View>
            </TouchableHighlight>
            <View style={styles.separator} />
        </View>
    );

    renderContent = () => {
        const { accounts } = this.props;
        return (
            <Animatable.View animation="fadeInDown" style={styles.contentContainer}>
                {_.map(accounts, (item, id) => this.renderRow(item, id))}
            </Animatable.View>
        );
    };

    render() {
        return (
            <View style={[styles.container]}>
                {/* Header Content */}
                {this.renderHeaderContent()}
                {/* Header Content */}

                {this.renderListHeader()}

                {/* Content */}
                {this.renderContent()}
                {/* Content */}
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default WalletsView;
