/**
 * Error Screen
 *
 <Error text={'Server is down'} />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';

// Consts and Libs
import { AppStyles, AppColors, AppFonts } from '@theme/';

// Components
import { Spacer } from '@components/';

/* Style ==================================================================== */
const styles = StyleSheet.create({
    buttonTry: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        height: 30,
        borderColor: AppColors.brand.secondary,
        borderWidth: 1.3,
        borderRadius: 0.5,
    },
    buttonTryText: {
        color: AppColors.textSecondary,
        fontFamily: AppFonts.familyBold,
    },
    icon: {
        tintColor: '#fff',
    },
});

/* Component ==================================================================== */
const Error = ({ text, tryAgain }) => (
    <View style={[AppStyles.container, AppStyles.containerCentered]}>
        <Image style={styles.icon} source={require('../assets/icons/icons8-box-important-100.png')} />

        <Spacer size={10} />

        <Text style={[AppStyles.textCenterAligned, { color: AppColors.textSecondary }]} h3>
            {text}
        </Text>

        <Spacer size={20} />

        {!!tryAgain && (
            <TouchableOpacity style={styles.buttonTry} onPress={tryAgain} activeOpacity={1}>
                <Text style={[styles.buttonTryText]}>TRY AGAIN</Text>
            </TouchableOpacity>
        )}
    </View>
);


Error.propTypes = { text: PropTypes.string, tryAgain: PropTypes.func };
Error.defaultProps = { text: 'Woops, Something went wrong.', tryAgain: null };
Error.componentName = 'Error';

/* Export Component ==================================================================== */
export default Error;
