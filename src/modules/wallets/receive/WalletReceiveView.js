/**
 * Receive Screen
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import _ from 'lodash';

import { View, Text, TouchableOpacity, StyleSheet, Clipboard } from 'react-native';

// Consts and Libs
import { AppStyles, AppSizes } from '@theme/';

import { QRCode, Toast, Spacer, PickerButton } from '@components/';

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
});

/* Component ==================================================================== */
class WalletReceiveView extends Component {
    static componentName = 'WalletReceiveView';

    static navigatorStyle = {
        navBarButtonColor: '#FFFFFF',
    };

    static propTypes = {
        // TODO: FixMe
        // eslint-disable-next-line react/forbid-prop-types
        accounts: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            account: _.values(props.accounts)[0],
        };
    }

    componentWillReceiveProps(nextProps) {
        const { account } = this.state;
        const { accounts } = nextProps;
        if (_.isUndefined(account)) {
            return;
        }
        if (!_.isEqual(_.get(accounts, account.address), account)) {
            this.setState({
                account: _.get(accounts, account.address),
            });
        }
    }

    showPicker = () => {
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

    handleCopy = () => {
        const { account } = this.state;
        Clipboard.setString(account.address);

        Toast.show('Success Copied To Clipboard');
    };

    render() {
        const { account } = this.state;
        if (!account) {
            return null;
        }
        return (
            <View style={[AppStyles.container, AppStyles.padding]}>
                <View style={AppStyles.flex1}>
                    <Text style={AppStyles.subtext}>Choose your prefer account from blow.</Text>
                    <Spacer size={10} />
                    <PickerButton onPress={this.showPicker}>
                        <Text style={AppStyles.baseText}>{account.label}</Text>
                        <Text style={[AppStyles.subtext]}>{account.balance.toFixed(2)} XRP</Text>
                    </PickerButton>
                </View>
                <View style={AppStyles.flex3}>
                    <View style={styles.qrCodeContainer}>
                        <QRCode
                            text={account.address}
                            width={AppSizes.screen.height / 3}
                            height={AppSizes.screen.height / 3}
                        />
                    </View>
                    <Text style={[AppStyles.subtext, AppStyles.textCenterAligned]}>{account.address}</Text>
                </View>

                <View style={[AppStyles.row]}>
                    <View style={AppStyles.flex3}>
                        <TouchableOpacity onPress={this.handleCopy}>
                            <Text style={[AppStyles.baseText, AppStyles.textCenterAligned]}>Copy</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={AppStyles.flex1}>
                        <Text style={[AppStyles.baseText, AppStyles.textCenterAligned]}>|</Text>
                    </View>
                    <View style={AppStyles.flex3}>
                        <TouchableOpacity
                            onPress={() => { console.warn('Not Implemented yet.'); }}
                        >
                            <Text style={[AppStyles.baseText, AppStyles.textCenterAligned]}>Share</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default WalletReceiveView;
