/**
 * Add New Contact View
 */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';

import { View, Text, Image, TouchableHighlight, StyleSheet } from 'react-native';

// Consts and Libs
import { AppStyles } from '@theme/';

import { Alert, TextInput, Spacer } from '@components/';

import { isValidAddress } from '@libs/ripple';

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
});

/* Component ==================================================================== */
class AddContactView extends Component {
    static componentName = 'AddContactView';

    static navigatorStyle = {
        navBarTitleTextCentered: false,
        navBarButtonColor: '#FFFFFF',
    };

    static navigatorButtons = {
        rightButtons: [
            {
                icon: require('../../../assets/icons/icons8-checkmark-96.png'),
                id: 'saveContact',
            },
        ],
    };

    constructor(props) {
        super(props);

        this.state = {
            name: null,
            address: null,
            destinationTag: null,
        };

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        if (event.type === 'NavBarButtonPress') {
            if (event.id === 'saveContact') {
                this.onSubmit();
            }
        }
    }

    onSubmit = () => {
        const { name, address, destinationTag } = this.state;

        if (!name) {
            return Alert.show('Please Enter A Name!', { type: 'error' });
        }

        if (!isValidAddress(address)) {
            return Alert.show('Invalid Ripple Address!', { type: 'error' });
        }

        return this.props
            .saveContact({
                name,
                address,
                destinationTag,
            })
            .then(() => {
                this.props.navigator.dismissModal();
            })
            .catch(error => {
                Alert.show(error, {
                    type: 'error',
                });
            });
    };

    showScanner = () => {
        this.props.navigator.showModal({
            screen: 'app.Scanner',
            title: 'New Contact',
            passProps: {
                onRead: this.onScannerRead,
            },
        });
    };

    onScannerRead = result => {
        const { data } = result;

        this.props.navigator.dismissModal();

        if (!isValidAddress(data)) {
            return Alert.show('Invalid Ripple Address!', { type: 'error' });
        }

        return this.setState({
            address: data,
        });
    };

    render() {
        return (
            <View style={[AppStyles.container, AppStyles.padding]}>
                <Text style={AppStyles.subtext}>Name</Text>
                <Spacer size={10} />
                <TextInput placeholder="Contact Name" onChangeText={name => this.setState({ name })} />

                <Spacer size={40} />

                <Text style={AppStyles.subtext}>Address</Text>
                <Spacer size={10} />
                <View style={AppStyles.row}>
                    <View style={AppStyles.flex4}>
                        <TextInput
                            placeholder="Enter Address"
                            onChangeText={input => this.setState({ address: input.replace(/\s/g, '') })}
                            value={this.state.address}
                        />
                    </View>
                    <TouchableHighlight style={styles.scanIcon} onPress={this.showScanner}>
                        <Image
                            source={require('../../../assets/icons/qr__code_coding_scan_qrcode-512.png')}
                            style={styles.scanIconImage}
                        />
                    </TouchableHighlight>
                </View>
                <TextInput
                    placeholder="Destination Tag"
                    onChangeText={input => this.setState({ destinationTag: input.replace(/[^0-9]/g, '') })}
                    value={this.state.destinationTag}
                />
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default AddContactView;
