// @flow

/**
 * Confirm Transaction and Submit Screen
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    View,
    StyleSheet,
    InteractionManager,
    Text,
} from 'react-native';

// Consts and Libs
import { AppStyles, AppColors, AppSizes, AppFonts } from '@theme/';

import { Spacer, Button, SlideButton, Alert } from '@components/';

import { submitTransaction } from '@libs/ripple';

import * as Animatable from 'react-native-animatable';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    slideButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: AppSizes.screen.width,
        height: 60,
        backgroundColor: AppColors.buttonPrimary,
    },
    circle: {
        borderWidth: 1.5,
        borderColor: '#0092d8',
        alignItems: 'center',
        justifyContent: 'center',
        width: 150,
        height: 150,
        borderRadius: 100,
    },
    buttonText: {
        fontSize: 25,
        color: AppColors.textPrimary,
        fontFamily: AppFonts.base.familyBold,
    },
    successIcon: {
        tintColor: '#3DD84C',
    },
    uploadIcon: {
        tintColor: '#FFF',
    },
    sliderButtonBackground: {
        backgroundColor: '#364150',
    },
});

/* Component ==================================================================== */
class RecipientPickerView extends Component {
    static componentName = 'RecipientPickerView';

    static navigatorStyle = {
        navBarTitleTextCentered: false,
        tabBarHidden: true,
        navBarButtonColor: '#FFFFFF',
    };

    static propTypes = {
        SignedTransaction: PropTypes.string.isRequired,
        // TODO: FixMe
        // eslint-disable-next-line react/forbid-prop-types
        Payment: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            isSubmitting: false,
            confirmed: false,
            submitted: false,
        };
    }

    componentDidMount = () => {
        InteractionManager.runAfterInteractions(() => {
            setInterval(() => {
                if (this.sliderText) {
                    this.sliderText.fadeInLeft(2000).then(() => {
                        this.sliderText.fadeOutRight(2000);
                    });
                }
            }, 1000);
        });
    };

    submitTransaction = () => {
        const { SignedTransaction } = this.props;
        this.setState({
            isSubmitting: true,
        });

        submitTransaction(SignedTransaction).then(
            result => {
                if (result.resultCode === 'tesSUCCESS') {
                    this.setState({
                        isSubmitting: false,
                        submitted: true,
                    });
                } else {
                    this.setState({
                        isSubmitting: false,
                    });
                    Alert.show(result.resultMessage, { type: 'error' });
                }
            },
            error => {
                console.warn(error);
            },
        );
    };

    onConfirm = () => {
        this.setState({
            confirmed: true,
        });

        this.submitTransaction();
    };

    renderFooter = () => {
        const { confirmed, isSubmitting } = this.state;
        if (!confirmed) {
            return (
                <View style={styles.sliderButtonBackground}>
                    <SlideButton onSlideSuccess={this.onConfirm} width={AppSizes.screen.width} height={60}>
                        <View style={styles.slideButton}>
                            <Animatable.Text
                                useNativeDriver
                                ref={element => { this.sliderText = element; }}
                                style={[AppStyles.baseText]}
                            >
                                Slide To Confirm
                            </Animatable.Text>
                        </View>
                    </SlideButton>
                </View>
            );
        }
        return (
            <Button
                isLoading={isSubmitting}
                style={AppStyles.secondaryButtonStyle}
                textStyle={styles.buttonText}
                activeOpacity={1}
                onPress={() => this.props.navigator.pop()}
            >
                Ok
            </Button>
        );
    };

    render() {
        const { Payment } = this.props;
        const { submitted } = this.state;
        return (
            <View style={AppStyles.container}>
                <View style={[AppStyles.flex1, AppStyles.centerAligned]}>
                    <View style={styles.circle}>
                        {submitted ? (
                            <Animatable.Image
                                animation="flipInX"
                                style={styles.successIcon}
                                source={require('../../../../assets/icons/icons8-checkmark-96.png')}
                            />
                        ) : (
                            <Animatable.Image
                                animation="pulse"
                                iterationCount="infinite"
                                style={styles.uploadIcon}
                                source={require('../../../../assets/icons/icons8-upload-to-cloud-50.png')}
                            />
                        )}
                    </View>
                    <Spacer size={30} />
                    {submitted ? (
                        <Text style={[AppStyles.baseText, AppStyles.textCenterAligned]}>
                            {Payment.amount} XRP Sent.
                        </Text>
                    ) : (
                        <Text style={[AppStyles.baseText, AppStyles.textCenterAligned]}>
                            {Payment.amount} <Text style={AppStyles.subtext}>XRP will be debited from </Text>
                            {Payment.from} <Text style={AppStyles.subtext}>and sent to</Text> {Payment.to}
                        </Text>
                    )}
                </View>
                {this.renderFooter()}
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default RecipientPickerView;
