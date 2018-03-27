/**
 * Setup Complete Screen
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { View, Text, StyleSheet, ScrollView } from 'react-native';

// Const and Libs
import { AppStyles, AppFonts, AppColors } from '@theme/';

// Components
import { Button, Spacer } from '@components/';

/* Styles  ==================================================================== */
const styles = StyleSheet.create({
    agreementContainer: {
        alignItems: 'flex-start',
        padding: 20,
    },
    buttonText: {
        fontSize: 25,
        color: AppColors.textPrimary,
        fontFamily: AppFonts.base.familyBold,
    },
});

/* Component ==================================================================== */
class setupCompleteView extends Component {
    static componentName = 'setupCompleteView';

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
        };
    }

    static navigatorStyle = {
        navBarNoBorder: true,
        navBarTransparent: true,
        navBarTextFontFamily: AppFonts.base.family,
        navBarTextFontSize: 25,
        navBarTextColor: '#fff',
        navBarButtonColor: '#fff',
    };

    static propTypes = {
        coreBoot: PropTypes.func.isRequired,
        coreInitialize: PropTypes.func.isRequired,
        createWallet: PropTypes.func.isRequired,
    };

    handleSubmit = async () => {
        const { coreBoot, coreInitialize, createWallet } = this.props;

        this.setState({ isLoading: true });

        await coreInitialize().then(async () => {
            await createWallet().then(() => {
                coreBoot();
            });
        });
    };

    render() {
        return (
            <View style={[AppStyles.container, AppStyles.paddingTop, AppStyles.flex1]}>
                <Spacer size={50} />
                <ScrollView>
                    <View style={AppStyles.row}>
                        <View style={styles.agreementContainer}>
                            <Text style={AppStyles.p}>
                                By pressing CONFIRM you understand and agree to the following:{'\n'}
                                {'\n'}
                                This seed you have entered is ONLY stored on your phone and is never transmitted.{'\n'}
                                {'\n'}
                                As such, if you phone is lost or destroyed the seed can NOT be recovered with out paper
                                key.{'\n'}
                                {'\n'}
                                You just can recover the main wallet by your paper key .{'\n'}
                                {'\n'}
                                It is your responsibility to store the seed in a safe place.{'\n'}
                                {'\n'}
                                The developers of this application are not liable for any losses incurred through the
                                use of this application.{'\n'}
                                {'\n'}
                                To understand the security measures of this application, please REVIEW the code on
                                GitHub.{'\n'}
                                {'\n'}
                            </Text>
                        </View>
                    </View>
                </ScrollView>

                <View style={[AppStyles.padding]}>
                    <Button
                        isLoading={this.state.isLoading}
                        style={AppStyles.secondaryButtonStyle}
                        textStyle={styles.buttonText}
                        activeOpacity={1}
                        onPress={this.handleSubmit}
                    >
                        Confirm & Finish
                    </Button>
                </View>
            </View>
        );
    }
}


/* Export Component ==================================================================== */
export default setupCompleteView;
