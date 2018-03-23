/**
 * Recover from Paper Key Screen
 */

import bip39 from 'bip39';

import _ from 'lodash';

import React, { Component } from 'react';

import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';

// Const and Libs
import { AppStyles, AppFonts, AppColors, AppSizes } from '@theme/';

// Components
import { Spacer, Button, Alert } from '@components/';

/* Styles  ==================================================================== */
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    row: {
        left: 0,
        right: 0,
        flexDirection: 'row',
        paddingHorizontal: AppSizes.padding,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 25,
        fontFamily: AppFonts.base.family,
    },
    input: {
        color: AppColors.textPrimary,
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
            paperKeys: new Array(12),
        };

        this.inputs = {};
    }

    onInputChange = (index, text) => {
        const { paperKeys } = this.state;
        paperKeys.splice(index - 1, 1, text);
        this.setState({
            paperKeys,
        });
    };

    handleSubmit = () => {
        const { paperKeys } = this.state;

        // if any of items is undefined don't do anything

        const mnemonic = paperKeys.join(' ');

        if (bip39.validateMnemonic(mnemonic)) {
            this.props.navigator.push({
                screen: 'app.Recover.SetPassword',
                title: 'Setup Password',
                passProps: { mnemonic },
                animationType: 'fade',
            });
        } else {
            Alert.show('Invalid Paper Key, Please check words and try again. ', {
                type: 'error',
            });
        }
    };

    handleTextSubmit = (index) => {
        if (index === 12) {
            this.handleSubmit();
        } else {
            this.inputs[index + 1].focus();
        }
    };

    renderInputsRow = (from, to) =>
        _.map(_.range(from, to + 1), index => (
            <View style={AppStyles.flex1} key={index}>
                <TextInput
                    ref={input => {
                        this.inputs[index] = input;
                    }}
                    underlineColorAndroid={AppColors.brand.secondary}
                    placeholderTextColor={AppColors.textSecondary}
                    onChangeText={text => this.onInputChange(index, text)}
                    onSubmitEditing={() => { this.handleTextSubmit(index); }}
                    blurOnSubmit={false}
                    returnKeyType={index === 12 ? 'done' : 'next'}
                    style={styles.input}
                />
                <Text style={[AppStyles.baseText, AppStyles.textCenterAligned]}>{index}</Text>
            </View>
        ));

    render() {
        return (
            <ScrollView contentContainerStyle={styles.container} style={[AppStyles.container, AppStyles.paddingTop]}>
                <Spacer size={30} />
                <View style={[AppStyles.flex6]}>
                    <View style={[AppStyles.row, AppStyles.padding]}>
                        <Text style={AppStyles.baseText}>Enter the paper key for the wallet you want to recover.</Text>
                    </View>
                    <View style={[styles.row]}>{this.renderInputsRow(1, 3)}</View>
                    <View style={[styles.row]}>{this.renderInputsRow(4, 6)}</View>
                    <View style={[styles.row]}>{this.renderInputsRow(7, 9)}</View>
                    <View style={[styles.row]}>{this.renderInputsRow(10, 12)}</View>
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
