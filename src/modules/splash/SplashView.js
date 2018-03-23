/**
 *
 * Splash Screen
 *  - start screen if user is new to us
 */
import React, { Component } from 'react';

import { View, StyleSheet, Text } from 'react-native';

import { AppStyles, AppFonts, AppColors } from '@theme/';

import { Spacer, Button } from '@components/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    logo: {
        textAlign: 'center',
        color: 'white',
        fontSize: 70,
        fontFamily: AppFonts.base.family,
    },
    slug: {
        color: AppColors.textSecondary,
        fontSize: 20,
        fontFamily: AppFonts.base.familyBold,
    },
    whiteText: {
        color: '#fff',
    },
    // bottomAction: {
    //     flex: 1,
    //     position: 'absolute',
    //     backgroundColor: 'rgba(6,56,82, 0.7)',
    //     bottom: 0,
    //     right: 0,
    //     left: 0,
    //     height: 40,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    // },
    newWalletButtonText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 25,
        fontFamily: AppFonts.base.family,
    },
    recoverWalletButtonText: {
        textAlign: 'center',
        fontSize: 25,
        color: AppColors.headingPrimary,
        fontFamily: AppFonts.base.family,
    },
});

/* Component ==================================================================== */
class SplashView extends Component {
    static componentName = 'SplashView';

    static navigatorStyle = {
        navBarHidden: true,
        navigationBarColor: AppColors.background,
        statusBarColor: AppColors.background,
    };

    render() {
        return (
            <View style={[AppStyles.container]}>
                <Spacer size={50} />

                <View style={[AppStyles.row, AppStyles.paddingHorizontal, AppStyles.centerAligned]}>
                    <Text
                        style={styles.logo}
                    >
                        Artunis
                    </Text>
                </View>

                <View style={[AppStyles.row, AppStyles.paddingHorizontal, AppStyles.centerAligned]}>
                    <Text
                        style={styles.slug}
                    >
                        Your Secure XRP Wallet
                    </Text>
                </View>

                <Spacer size={150} />

                <View style={[AppStyles.padding, AppStyles.centerAligned]}>
                    <Button
                        style={AppStyles.primaryButtonStyle}
                        textStyle={styles.newWalletButtonText}
                        activeOpacity={1}
                        onPress={() => {
                            this.props.navigator.push({
                                screen: 'app.Intro',
                            });
                        }}
                    >
                        Create New Wallet
                    </Button>
                </View>

                <Text h5 style={[AppStyles.textCenterAligned, styles.whiteText]}>
                    - or -
                </Text>

                <View style={[AppStyles.padding, AppStyles.centerAligned]}>
                    <Button
                        style={AppStyles.secondaryButtonStyle}
                        textStyle={styles.recoverWalletButtonText}
                        activeOpacity={1}
                        onPress={() => {
                            this.props.navigator.push({
                                screen: 'app.Recover.PaperKey',
                                title: 'Recover Wallet',
                            });
                        }}
                    >
                        Recover Wallet
                    </Button>
                </View>

                {/* <View style={[AppStyles.row, styles.bottomAction]}> */}
                {/* <Text style={[styles.whiteText]} onPress={() => {console.log('help page');}}> */}
                {/* Need help ? */}
                {/* </Text> */}
                {/* </View> */}
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default SplashView;
