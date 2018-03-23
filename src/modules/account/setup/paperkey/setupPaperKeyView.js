/**
 * Setup Paper Key Screen
 */

import _ from 'lodash';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { View, Text, StyleSheet, TextInput } from 'react-native';

// Const and Libs
import { AppStyles, AppFonts, AppColors } from '@theme/';

import { RandomNumber } from '@libs/utils';
import { PaperKey } from '@libs/crypto';

// Components
import { Spacer, Button, Alert, PaperKeySlider } from '@components/';

const CHALLENGE_LENGTH = 3;


/* Styles  ==================================================================== */
const styles = StyleSheet.create({
    submitButtonText: {
        color: 'white',
        fontSize: 25,
        fontFamily: AppFonts.base.family,
    },
    input: {
        paddingTop: 7,
        paddingBottom: 10,
        fontSize: 20,
        color: AppColors.textPrimary,
        fontFamily: AppFonts.base.family,
    },
});


/* Component ==================================================================== */
class setupPaperKeyView extends Component {
    static componentName = 'setupPaperKeyView';

    static navigatorStyle = {
        navBarNoBorder: true,
        navBarTransparent: true,
        navBarTextFontFamily: AppFonts.base.family,
        navBarTextFontSize: 25,
        navBarTextColor: '#fff',
        navBarButtonColor: '#fff',
    };

    static propTypes = {
        password: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            paperKeys: [],
            verificationStep: false,
            entryChallenges: {},
            randomChallengesIndex: [],
        };
    }

    componentWillMount() {
        // generate random key when screen shows up
        this.setState({ paperKeys: PaperKey.generate().split(' ') });
    }

    /* Key Verification Step ===================  */
    handleVerifySubmit = () => {
        const { entryChallenges, paperKeys } = this.state;

        const { password } = this.props;

        if (_.size(entryChallenges) !== CHALLENGE_LENGTH) {
            return Alert.show("Please complete all input's", { type: 'error' });
        }

        _.mapValues(entryChallenges, (value, key) => {
            if (paperKeys[key - 1] !== value) {
                return Alert.show('Wrong Values ...', { type: 'error' });
            }

            return null;
        });

        // If everything is fine then send password and generate paperKeys to create wallet screen
        return this.props.navigator.push({
            screen: 'app.Setup.Complete',
            title: 'Agreement',
            passProps: { password, paperKeys: paperKeys.join(' ') },
            animationType: 'fade',
        });
    };

    onInputChange = (index, text) => {
        this.setState({
            entryChallenges: Object.assign({}, this.state.entryChallenges, {
                [index]: text,
            }),
        });
    };

    renderVerifyStep = () => {
        const { randomChallengesIndex } = this.state;
        return (
            <View style={[AppStyles.container, AppStyles.paddingTop, AppStyles.flex1]}>
                <Spacer size={30} />
                <View style={[AppStyles.row, AppStyles.padding]}>
                    <Text style={AppStyles.baseText}>
                        To make sure everything was written down correctly, please enter the following words from your
                        paper key.
                    </Text>
                </View>

                <View style={AppStyles.padding}>
                    {_.map(randomChallengesIndex, index => (
                        <TextInput
                            underlineColorAndroid="transparent"
                            placeholderTextColor={AppColors.textSecondary}
                            placeholder={`word #${index}`}
                            key={index}
                            style={styles.input}
                            onChangeText={text => this.onInputChange(index, text)}
                        />
                    ))}
                </View>

                <View style={[AppStyles.flex1, AppStyles.padding]}>
                    <Button
                        style={AppStyles.primaryButtonStyle}
                        textStyle={styles.submitButtonText}
                        activeOpacity={1}
                        onPress={this.handleVerifySubmit}
                    >
                        Submit
                    </Button>
                </View>
            </View>
        );
    };

    /* Paper Key List View Step ===================  */

    onPaperKeyListEnd = () => {
        const { paperKeys } = this.state;
        // In the end of paper key list show verification step and choose random key to verify
        this.setState({
            verificationStep: true,
            randomChallengesIndex: RandomNumber(paperKeys.length, CHALLENGE_LENGTH),
        });
    };

    renderKeysListStep = () => {
        const { paperKeys } = this.state;
        return (
            <View style={[AppStyles.container, AppStyles.paddingTop, AppStyles.flex1]}>
                <Spacer size={30} />
                <PaperKeySlider keys={paperKeys} onListEnd={this.onPaperKeyListEnd} />
            </View>
        );
    };

    /* Render  ===================  */

    render() {
        const { verificationStep } = this.state;

        if (!verificationStep) {
            return this.renderKeysListStep();
        }
        return this.renderVerifyStep();
    }
}


/* Export Component ==================================================================== */
export default setupPaperKeyView;
