import _ from 'lodash';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, TouchableHighlight, Image } from 'react-native';
import { AppStyles, AppColors } from '@theme/';

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
    },
    rowContent: {
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    labelTextWrap: {
        justifyContent: 'center',
    },
    avatar: {
        width: 38,
        height: 38,
        marginRight: 10,
        tintColor: '#FFF',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 8,
    },
    name: {
        fontSize: 16,
        fontWeight: '500',
        color: AppColors.textPrimary,
    },
    address: {
        fontSize: 11,
        color: AppColors.textSecondary,
    },
});

/* Component ==================================================================== */
class Picker extends Component {
    static componentName = 'Picker';

    static navigatorStyle = {
        navBarTitleTextCentered: false,
    };

    static propTypes = {
        // items: PropTypes.object.isRequired,
        onSelect: PropTypes.func.isRequired,
        type: PropTypes.string,
    };

    static defaultProps = {
        type: 'account',
    };

    onSelect = selectedItem => {
        const { item } = selectedItem;
        this.props.onSelect(item);
        this.props.navigator.dismissModal({
            animationType: 'fade',
        });
    };

    renderContacts = () => {
        const { items } = this.props;
        return (
            <View style={AppStyles.flex1}>
                {_.map(items, item => (
                    <View key={item.address}>
                        <TouchableHighlight
                            onPress={() => {
                                this.onSelect({ item });
                            }}
                            underlayColor="rgba(154, 154, 154, 0.25)"
                        >
                            <View style={styles.row}>
                                <Image
                                    style={styles.avatar}
                                    source={require('../../assets/icons/icons8-male-user2-64.png')}
                                />
                                <View>
                                    <Text style={styles.name}>{item.name}</Text>
                                    <Text style={styles.address}>{item.address}</Text>
                                </View>
                            </View>
                        </TouchableHighlight>
                    </View>
                ))}
            </View>
        );
    };

    renderAccounts = () => {
        const { items } = this.props;
        return (
            <View style={AppStyles.flex1}>
                {_.map(items, item => (
                    <View key={item.address}>
                        <TouchableHighlight
                            style={styles.rowContainer}
                            onPress={() => {
                                this.onSelect({ item });
                            }}
                        >
                            <View style={styles.rowContent}>
                                <View style={styles.labelTextWrap}>
                                    <Text style={AppStyles.baseText}>{item.label}</Text>
                                    <Text style={[AppStyles.subtext, AppStyles.textLeftAligned]}>
                                        {item.address}
                                    </Text>
                                </View>
                                <View style={styles.labelTextWrap}>
                                    <Text style={AppStyles.h5}>{item.balance.toFixed(2)}</Text>
                                    <Text style={[AppStyles.subtext, AppStyles.textRightAligned]}>XRP</Text>
                                </View>
                            </View>
                        </TouchableHighlight>
                    </View>
                ))}
            </View>
        );
    };

    renderContent = () => {
        const { type } = this.props;
        switch (type) {
            case 'account':
                return this.renderAccounts();
            case 'contact':
                return this.renderContacts();
            default:
                return null;
        }
    };

    render() {
        return <View style={styles.container}>{this.renderContent()}</View>;
    }
}


export default Picker;
