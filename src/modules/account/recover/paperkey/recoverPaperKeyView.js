/**
 * Recover from Paper Key Screen
 */

import bip39 from 'bip39';

import React, { Component } from 'react';

import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';

// Const and Libs
import { AppStyles, AppFonts, AppColors, AppSizes } from '@theme/';

// Components
import { Spacer, Button, Alert } from '@components/';

/* Styles  ==================================================================== */
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 25,
        fontFamily: AppFonts.base.family,
    },
    input: {
        height: AppSizes.screen.height * 0.3,
        borderColor: AppColors.buttonPrimaryBorder,
        borderBottomWidth: 1,
        fontSize: 20,
        lineHeight: 30,
        padding: AppSizes.paddingSml,
        color: AppColors.textPrimary,
        fontFamily: AppFonts.base.family,
        backgroundColor: '#364150',
        textAlignVertical: 'top',
    },
});

/* Component ==================================================================== */
class recoverPaperKeyView extends Component {
    static componentName = 'recoverPaperKeyView';

    static navigatorStyle = {
        navBarNoBorder: true,
        navBarTransparent: true,
        navBarTextFontFamily: AppFonts.base.family,
        navBarTextFontSize: 25,
        navBarTextColor: '#fff',
        navBarButtonColor: '#fff',
    };

    constructor(props) {
        super(props);

        this.state = {
            paperKeys: null,
        };
    }

    handleSubmit = () => {
        const { paperKeys } = this.state;

        // if any of items is undefined don't do anything

        if (bip39.validateMnemonic(paperKeys)) {
            this.props.navigator.push({
                screen: 'app.Recover.SetPassword',
                title: 'Setup Password',
                passProps: { mnemonic: paperKeys },
                animationType: 'fade',
            });
        } else {
            Alert.show('Invalid Paper Key, Please check words and try again. ', {
                type: 'error',
            });
        }
    };


    render() {
        return (
            <ScrollView contentContainerStyle={styles.container} style={[AppStyles.container, AppStyles.paddingTop]}>
                <Spacer size={30} />
                <View style={[AppStyles.flex6, AppStyles.padding]}>
                    <Text style={AppStyles.baseText}>
                        Enter the paper key for the wallet you want to recover ( USUALLY 24 WORDS )
                    </Text>
                    <Spacer size={30} />
                    <TextInput
                        style={[styles.input]}
                        onChangeText={(paperKeys) => this.setState({ paperKeys })}
                        multiline
                        underlineColorAndroid="transparent"
                        autoCorrect
                        autoFocus
                    />
                </View>
                <View style={[AppStyles.flex1, AppStyles.padding]}>
                    <Button
                        style={AppStyles.primaryButtonStyle}
                        textStyle={styles.submitButtonText}
                        activeOpacity={1}
                        onPress={this.handleSubmit}
                    >
                        Next
                    </Button>
                </View>
            </ScrollView>
        );
    }
}


/* Export Component ==================================================================== */
export default recoverPaperKeyView;
