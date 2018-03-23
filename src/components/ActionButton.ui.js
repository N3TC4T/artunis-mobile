import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, Image, Text, TouchableHighlight, StyleSheet } from 'react-native';

import { AppFonts } from '@theme/';

const icons = {
    contacts: require('../assets/icons/icons8-contacts-64.png'),
    clipboard: require('../assets/icons/icons8-note-taking-50.png'),
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
        alignSelf: 'stretch',
        padding: 5,
        marginTop: 5,
        marginBottom: 5,
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
        alignSelf: 'stretch',
    },
    iconWrapper: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    icon: {
        marginRight: 10,
        height: 25,
        width: 25,
        tintColor: '#FFF',
    },
    labelWrapper: {
        flex: 3,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    label: {
        fontSize: 20,
        fontFamily: AppFonts.base.family,
        color: '#FAFAFA',
        marginLeft: 10,
        marginTop: 2,
    },
});

export default class ActionButton extends Component {
    static propTypes = {
        label: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
        onPress: PropTypes.func.isRequired,
    };

    render() {
        return (
            <TouchableHighlight onPress={this.props.onPress} style={styles.wrapper}>
                <View style={styles.container}>
                    <View style={styles.labelWrapper}>
                        <Text style={styles.label}>{this.props.label}</Text>
                    </View>
                    <View style={styles.iconWrapper}>
                        <Image style={styles.icon} source={icons[this.props.icon]} />
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}
