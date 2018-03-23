/**
 * Set Password Screen
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { View, Text, StyleSheet, ScrollView } from 'react-native';

// Const and Libs
import { AppStyles, AppFonts } from '@theme/';

// Components
import { Button, Alert, Spacer, PasswordInput } from '@components/';


/* Styles  ==================================================================== */
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    buttonText: {
        fontSize: 25,
        color: 'white',
        fontFamily: AppFonts.base.familyBold,
    },
});


/* Component ==================================================================== */
class setPasswordView extends Component {
    static componentName = 'setPasswordView';

    static navigatorStyle = {
        drawUnderNavBar: true,
        navBarTransparent: true,
        navBarTranslucent: true,
        navBarTextFontFamily: AppFonts.base.family,
        navBarTextFontSize: 25,
        navBarTextColor: '#fff',
        navBarButtonColor: '#fff',
    };

    static propTypes = {
        mnemonic: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            password: {
                value: '',
                isValid: false,
            },
            password_confirmation: '',
        };
    }

    handleSubmit = async () => {
        const { password, password_confirmation } = this.state;
        const { coreBoot, coreInitialize, createWallet, mnemonic } = this.props;

        if (password.isValid) {
            if (password.value !== password_confirmation) {
                Alert.show('Your passwords did not match', { type: 'error' });
                return;
            }

            // If everything is fine then create wallet by given details

            this.setState({ isLoading: true });

            await coreInitialize(mnemonic, password.value).then(() => {
                createWallet(password.value).then(() => {
                    coreBoot();
                });
            });
        } else {
            Alert.show('Your password should contain letters , uppercase and symbols', {
                type: 'error',
            });
        }
    };

    render() {
        const { password } = this.state;
        return (
            <ScrollView contentContainerStyle={styles.container} style={[AppStyles.container, AppStyles.paddingTop]}>
                <View style={AppStyles.flex6}>
                    <Spacer size={30} />
                    <View style={AppStyles.padding}>
                        <Text style={AppStyles.p}>
                            Your Passphrase will be used to unlock your wallet and send money.
                        </Text>
                    </View>
                    <View style={AppStyles.paddingHorizontal}>
                        <PasswordInput
                            placeholder="Enter Password"
                            minLength={8}
                            onChangeText={(value, isValid) => this.setState({ password: { value, isValid } })}
                        />
                    </View>

                    <Spacer size={20} />

                    <View style={AppStyles.paddingHorizontal}>
                        <PasswordInput
                            editable={password.isValid}
                            selectTextOnFocus={password.isValid}
                            simpleInput
                            placeholder="Repeat Password"
                            onChangeText={password_confirmation => this.setState({ password_confirmation })}
                        />
                    </View>
                </View>

                <View style={[AppStyles.flex1, AppStyles.padding]}>
                    <Button
                        isLoading={this.state.isLoading}
                        style={AppStyles.primaryButtonStyle}
                        textStyle={styles.buttonText}
                        activeOpacity={1}
                        onPress={this.handleSubmit}
                    >
                        Finish
                    </Button>
                </View>
            </ScrollView>
        );
    }
}


/* Export Component ==================================================================== */
export default setPasswordView;
