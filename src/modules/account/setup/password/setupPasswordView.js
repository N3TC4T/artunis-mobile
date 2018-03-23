/**
 * Setup Password Screen
 */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';

import { View, Text, StyleSheet } from 'react-native';

// Const and Libs
import { AppStyles, AppFonts } from '@theme/';

// Components
import { Button, Alert, Spacer, PasswordInput } from '@components/';

/* Styles  ==================================================================== */
const styles = StyleSheet.create({
    buttonText: {
        fontSize: 25,
        color: 'white',
        fontFamily: AppFonts.base.familyBold,
    },
});


/* Component ==================================================================== */
class setupPasswordView extends Component {
    static componentName = 'setupPasswordView';

    static navigatorStyle = {
        navBarTransparent: true,
        navBarTranslucent: true,
        navBarTextFontFamily: AppFonts.base.family,
        navBarTextFontSize: 25,
        navBarTextColor: '#fff',
        navBarButtonColor: '#fff',
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

    handleSubmit = () => {
        const { password, password_confirmation } = this.state;

        if (password.isValid) {
            if (password.value !== password_confirmation) {
                Alert.show('Your passwords did not match', { type: 'error' });
                return;
            }

            // If everything is fine then move to Paper Key View
            this.props.navigator.push({
                screen: 'app.Setup.PaperKey',
                title: 'Paper Key',
                passProps: { password: password.value },
                animationType: 'fade',
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
            <View style={[AppStyles.container, AppStyles.paddingTop, AppStyles.flex1]}>
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
                        style={AppStyles.secondaryButtonStyle}
                        textStyle={styles.buttonText}
                        activeOpacity={1}
                        onPress={this.handleSubmit}
                    >
                        Confirm
                    </Button>
                </View>
            </View>
        );
    }
}


/* Export Component ==================================================================== */
export default setupPasswordView;
