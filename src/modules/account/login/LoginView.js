/**
 * Login Screen
 *  - Shows pin code input
 */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';

import { View, Text } from 'react-native';

// Consts and Libs
import { AppStyles } from '@theme/';

/* Component ==================================================================== */
class LoginView extends Component {
    static componentName = 'LoginView';

    static navigatorStyle = {
        navBarTransparent: true,
        navBarTranslucent: true,
        navBarButtonColor: '#FFFFFF',
    };

    render() {
        return (
            <View style={[AppStyles.container]}>
                <Text>Login</Text>
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default LoginView;
