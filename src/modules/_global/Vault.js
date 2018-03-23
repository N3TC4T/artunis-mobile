// @flow

/**
 * Open Vault by password and return seed
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Consts and Libs
import { AppStyles, AppColors, AppSizes } from '@theme/';

import { PasswordInput, LoadingIndicator } from '@components/';

import { Vault } from '@libs/vault';

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
class VaultOpener extends Component {
    static componentName = 'VaultOpener';

    static navigatorStyle = {
        navBarTitleTextCentered: false,
        tabBarHidden: true,
        navBarButtonColor: '#FFFFFF',
    };

    static propTypes = {
        onDismissed: PropTypes.func.isRequired,
        onOpen: PropTypes.func.isRequired,
        title: PropTypes.string,
    };

    static defaultProps = {
        title: 'Please enter your password to open the vault.',
    };

    constructor(props) {
        super(props);

        this.state = {
            password: null,
        };
    }

    componentWillUnmount() {
        this.props.onDismissed();
    }

    handleSubmit = async () => {
        const { password } = this.state;

        if (!password) {
            return;
        }

        const seed = await Vault.open('seed', password);
        if (!seed) {
            this.view.shake(800);
        } else {
            this.props.onOpen(seed);
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
                    <Text style={AppStyles.subtext}>{this.props.title}</Text>
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
export default VaultOpener;
