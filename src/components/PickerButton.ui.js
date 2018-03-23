import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(52, 52, 52, 0.5)',
        padding: 8,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    contentWrapper: {
        flex: 1,
        flexDirection: 'column',
    },
    iconWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconImage: {
        tintColor: '#0896d6',
        width: 25,
        height: 25,
    },
});

export default class PickerButton extends Component {
    static propTypes = {
        onPress: PropTypes.func.isRequired,
    };

    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress} style={styles.container}>
                <View style={styles.rowContainer}>
                    <View style={styles.contentWrapper}>{this.props.children}</View>
                    <View style={styles.iconWrapper}>
                        <Image
                            source={require('../assets/icons/icons8-forward-40.png')}
                            style={styles.iconImage}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

