/* eslint-disable react-native/no-inline-styles */
// TODO: FixMe
/**
 * Intro Screen
 *  - Shows a nice slides information about XRP:
 *  - in the end user can create wallet
 */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    ImageBackground,
    Animated,
} from 'react-native';

// Consts and Libs
import { AppStyles, AppColors, AppSizes, AppFonts } from '@theme/';

import { Slider, Spacer } from '@components/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    backgroundImage: {
        // opacity: 0.5,
        backgroundColor: AppColors.background,
        flex: 1,
        width: '100%',
    },
    slugText: {
        color: AppColors.textPrimary,
        textAlign: 'center',
        fontSize: 30,
        fontFamily: AppFonts.base.familyBold,
    },
    descriptionText: {
        color: AppColors.textPrimary,
        fontSize: 20,
        textAlign: 'center',
        fontFamily: AppFonts.base.family,
    },
    startButton: {
        justifyContent: 'center',
        padding: 10,
        borderRadius: 3,
        backgroundColor: AppColors.buttonPrimary,
        width: AppSizes.screen.width * 0.8,
        height: 60,
        marginTop: 10,
    },
    startButtonText: {
        textAlign: 'center',
        color: 'white',
    },
});

/* Component ==================================================================== */
class Page extends Component {
    static componentName = 'Page';
    constructor(props) {
        super(props);
        this.progress = props.progress;
    }

    render() {
        return (
            <ImageBackground
                source={require('../../assets/images/bg2.png')}
                style={[AppStyles.flex1, AppStyles.containerCentered, AppStyles.padding, styles.backgroundImage]}
            >
                <Animated.View
                    style={[
                        AppStyles.flex1,
                        AppStyles.containerCentered,
                        AppStyles.padding,
                        {
                            transform: [
                                {
                                    scale: this.progress.interpolate({
                                        inputRange: [-1, 0, 1],
                                        outputRange: [4, 1, 0],
                                    }),
                                },
                            ],
                            opacity: this.progress.interpolate({
                                inputRange: [-0.25, 0, 1],
                                outputRange: [0, 1, 1],
                            }),
                        },
                    ]}
                >
                    {this.props.children}
                </Animated.View>
            </ImageBackground>
        );
    }
}

/* Component ==================================================================== */
// eslint-disable-next-line react/no-multi-comp
class IntroView extends Component {
    static componentName = 'IntroView';

    static navigatorStyle = {
        navBarTransparent: true,
        navBarTranslucent: true,
        navBarButtonColor: '#FFFFFF',
    };

    render() {
        return (
            <View style={[AppStyles.container]}>
                <Slider>
                    <Page>
                        <View style={[AppStyles.flex1, AppStyles.centerAligned]}>
                            <Image
                                source={require('../../assets/images/xrp.png')}
                                style={{ width: 200 }}
                                resizeMode="contain"
                            />
                        </View>
                        <View style={AppStyles.flex1}>
                            <Text style={[styles.slugText, { color: AppColors.brand.primary }]}>XRP</Text>
                            <Spacer size={30} />
                            <Text style={styles.descriptionText}>
                                Built for enterprise use, XRP offers banks and payment providers a reliable, on-demand
                                option to source liquidity for cross-border payments.
                            </Text>
                        </View>
                    </Page>

                    <Page>
                        <View style={[AppStyles.flex1, AppStyles.centerAligned]}>
                            <Image source={require('../../assets/images/slide1.png')} resizeMode="contain" />
                        </View>
                        <View style={AppStyles.flex1}>
                            <Text style={styles.slugText}>BANKS</Text>
                            <Spacer size={30} />
                            <Text style={styles.descriptionText}>
                                Using XRP, banks can source liquidity on demand in real time without having to pre-fund
                                nostro accounts.
                            </Text>
                        </View>
                    </Page>

                    <Page>
                        <View style={[AppStyles.flex1, AppStyles.centerAligned]}>
                            <Image source={require('../../assets/images/slide2.png')} resizeMode="contain" />
                        </View>
                        <View style={AppStyles.flex1}>
                            <Text style={styles.slugText}>PAYMENT PROVIDERS</Text>
                            <Spacer size={30} />
                            <Text style={styles.descriptionText}>
                                Payment Providers use XRP to expand reach into new markets, lower foreign exchange costs
                                and provide faster payment settlement.
                            </Text>
                        </View>
                    </Page>

                    <Page>
                        <View style={[AppStyles.flex1, AppStyles.centerAligned]}>
                            <Image
                                source={require('../../assets/images/slide3.png')}
                                resizeMode="contain"
                                style={{ width: 250 }}
                            />
                        </View>
                        <View style={AppStyles.flex1}>
                            <Spacer size={10} />
                            <Text style={styles.slugText}>ALMOST DONE!</Text>
                            <Text style={styles.descriptionText}>Just one Step to get your wallet ...</Text>
                            <Spacer size={20} />
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() =>
                                    this.props.navigator.push({
                                        screen: 'app.Setup.Password',
                                        title: 'Setup Password',
                                    })
                                }
                            >
                                <View style={styles.startButton}>
                                    <Text style={styles.startButtonText}>Create Wallet</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </Page>
                </Slider>
            </View>
        );
    }
}


/* Export Component ==================================================================== */
export default IntroView;
