import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { AppStyles } from '@theme/';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: 300,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1c202e',
    },
});

class Drawer extends Component {
    static componentName = 'Drawer';

    // toggleDrawer() {
    //     this.props.navigator.toggleDrawer({
    //         to: 'closed',
    //         side: 'right',
    //         animated: true,
    //     });
    // }

    render() {
        return (
            <View style={styles.container}>
                <Text style={AppStyles.baseText}>upcoming ....</Text>
            </View>
        );
    }
}

export default Drawer;
