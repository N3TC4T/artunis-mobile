// import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

import { AppFonts, AppColors } from '@theme';


const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: 'rgba(52, 52, 52, 0.5)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
        alignSelf: 'stretch',
        paddingHorizontal: 5,
    },
    input: {
        flex: 1,
        fontSize: 20,
        color: AppColors.textPrimary,
        fontFamily: AppFonts.base.family,
    },
});


export default class Input extends Component {
    // static propTypes = {
    //     label: PropTypes.string.isRequired,
    //     icon: PropTypes.string.isRequired,
    //     onPress: PropTypes.func.isRequired
    // };
    //
    // constructor(props) {
    //     super(props);
    //
    // }

    render() {
        return (
            <View style={styles.wrapper}>
                <TextInput
                    {...this.props}
                    placeholderTextColor={AppColors.textSecondary}
                    autoCapitalize="none"
                    autoCorrect={false}
                    multiline={false}
                    underlineColorAndroid="transparent"
                    style={styles.input}
                    selectionColor="green"
                />
            </View>
        );
    }
}
