import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, TextInput, StyleSheet, Text, Image, Animated, ViewPropTypes } from 'react-native';

import { AppFonts, AppColors } from '@theme/';

import _ from 'lodash';

const BOX_HEIGHT = 100;

const regex = {
    digitsPattern: /\d/,
    lettersPattern: /[a-zA-Z]/,
    lowerCasePattern: /[a-z]/,
    upperCasePattern: /[A-Z]/,
    wordsPattern: /\w/,
    symbolsPattern: /\W/,
};


const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: 'transparent',
    },
    inputWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderBottomWidth: 0.8,
        borderColor: 'rgba(242, 242, 242, 0.5)',
    },
    input: {
        flex: 1,
        paddingTop: 7,
        paddingBottom: 10,
        fontSize: 20,
        color: AppColors.textPrimary,
        fontFamily: AppFonts.base.family,
    },
    passwordStrengthWrapper: {},
    visibilityWrapper: {
        justifyContent: 'center',
        paddingHorizontal: 5,
    },
});


export default class PasswordInput extends Component {
    static defaultProps = {
        simpleInput: false,
        minLength: 6,
    };

    static propTypes = {
        simpleInput: PropTypes.bool,
        minLength: PropTypes.number,
        onChangeText: PropTypes.func.isRequired,
        inputWrapperStyle: ViewPropTypes.style,
        inputStyle: TextInput.propTypes.style,
    };

    constructor(props) {
        super(props);
        this.state = {
            hidePassword: true,
            strengthBoxHeight: new Animated.Value(BOX_HEIGHT),
            rules: {
                isValidLength: false,
                hasSymbols: false,
                hasLetter: false,
                hasUpperCase: false,
                hasDigits: false,
            },
        };
    }

    toggleSwitch() {
        this.setState({ hidePassword: !this.state.hidePassword });
    }

    onChangeText(password) {
        const { minLength } = this.props;

        let isValid = false;

        const rules = {
            isValidLength: password.length >= minLength,
            hasSymbols: regex.symbolsPattern.test(password),
            hasLetter: regex.lettersPattern.test(password),
            hasUpperCase: regex.upperCasePattern.test(password),
            hasDigits: regex.digitsPattern.test(password),
        };

        this.setState({ rules });

        if (_.every(_.values(rules), v => v)) {
            isValid = true;

            Animated.timing(this.state.strengthBoxHeight, {
                toValue: 0,
                duration: 300,
            }).start();
        } else {
            Animated.timing(this.state.strengthBoxHeight, {
                toValue: BOX_HEIGHT,
                duration: 300,
            }).start();
        }

        this.props.onChangeText(password, isValid);
    }

    renderPasswordStrength() {
        const { rules } = this.state;

        const renderStyle = status => {
            if (status) {
                return {
                    fontFamily: AppFonts.base.family,
                    fontSize: 18,
                    color: 'green',
                };
            }
            return {
                fontFamily: AppFonts.base.family,
                fontSize: 18,
                color: 'grey',
            };
        };

        return (
            <Animated.View style={[styles.passwordStrengthWrapper, { height: this.state.strengthBoxHeight }]}>
                <Text style={renderStyle(rules.isValidLength)}>At least {this.props.minLength} characters</Text>

                <Text style={renderStyle(rules.hasDigits)}>At least one number (0-9)</Text>

                <Text style={renderStyle(rules.hasLetter)}>At least one letter (a-z)</Text>

                <Text style={renderStyle(rules.hasSymbols)}>At least one symbol</Text>

                <Text style={renderStyle(rules.hasUpperCase)}>At least one upperCase</Text>
            </Animated.View>
        );
    }

    renderPasswordInput() {
        const { inputWrapperStyle, inputStyle } = this.props;
        return (
            <View style={[styles.inputWrapper, inputWrapperStyle]}>
                <TextInput
                    placeholderTextColor={AppColors.textSecondary}
                    secureTextEntry={this.state.hidePassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    multiline={false}
                    underlineColorAndroid="transparent"
                    {...this.props}
                    style={[styles.input, inputStyle]}
                    onChangeText={text => this.onChangeText(text)}
                />
                <TouchableOpacity
                    style={{ }}
                    onPress={() => {
                        this.toggleSwitch();
                    }}
                >
                    {this.state.hidePassword === false ? (
                        <Image source={require('../assets/icons/hide.png')} tintColor={AppColors.textPrimary} />
                    ) : (
                        <Image source={require('../assets/icons/show.png')} tintColor={AppColors.textSecondary} />
                    )}
                </TouchableOpacity>
            </View>
        );
    }

    renderSimplePasswordInput() {
        const { inputWrapperStyle, inputStyle } = this.props;

        return (
            <View style={[styles.inputWrapper, inputWrapperStyle]}>
                <TextInput
                    placeholderTextColor={AppColors.textSecondary}
                    secureTextEntry={this.state.hidePassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    multiline={false}
                    underlineColorAndroid="transparent"
                    {...this.props}
                    style={[styles.input, inputStyle]}
                    onChangeText={text => this.props.onChangeText(text)}
                />
                <TouchableOpacity
                    style={styles.visibilityWrapper}
                    onPress={() => {
                        this.toggleSwitch();
                    }}
                >
                    {this.state.hidePassword === false ? (
                        <Image source={require('../assets/icons/hide.png')} tintColor={AppColors.textPrimary} />
                    ) : (
                        <Image source={require('../assets/icons/show.png')} tintColor={AppColors.textSecondary} />
                    )}
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        const { simpleInput } = this.props;

        if (simpleInput) {
            return <View style={styles.wrapper}>{this.renderSimplePasswordInput()}</View>;
        }
        return (
            <View style={styles.wrapper}>
                {this.renderPasswordInput()}
                {this.renderPasswordStrength()}
            </View>
        );
    }
}

