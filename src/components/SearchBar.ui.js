import React, { Component } from 'react';
import { StyleSheet, TextInput, View, Image } from 'react-native';
import PropTypes from 'prop-types';

// Consts and Libs
import { AppStyles, AppColors } from '@theme/';

const styles = StyleSheet.create({
    input: {
        height: 40,
        paddingHorizontal: 10,
        paddingRight: 30,
        color: 'white',
    },
    icon: {
        tintColor: '#FFF',
        width: 20,
        height: 20,
    },
});

// Components
export default class SearchBar extends Component {
    constructor() {
        super();
        this.state = {
            text: '',
        };
    }
    render() {
        const { placeHolder, backgroundColor, innerBackground, border, radius, onChangeText } = this.props;
        return (
            <View style={[AppStyles.row, AppStyles.paddingLeftSml, { backgroundColor }]}>
                <View style={[AppStyles.flex1, AppStyles.centerAligned]}>
                    <Image
                        source={require('../assets/icons/icons8-search-50.png')}
                        style={styles.icon}
                    />
                </View>
                <View style={AppStyles.flex6}>
                    <TextInput
                        style={[
                            styles.input,
                            // eslint-disable-next-line react-native/no-inline-styles
                            {
                                backgroundColor: innerBackground,
                                borderRadius: radius,
                                borderWidth: border ? 1 : 0,
                            },
                        ]}
                        onChangeText={text => {
                            this.setState({ text });
                            onChangeText(text);
                        }}
                        value={this.state.text}
                        placeholder={placeHolder}
                        placeholderTextColor="#9197A3"
                        underlineColorAndroid="rgba(0,0,0,0)"
                    />
                </View>
            </View>
        );
    }
}
SearchBar.defaultProps = {
    placeHolder: 'SearchBar messages',
    backgroundColor: AppColors.brand.secondary,
    innerBackground: AppColors.brand.secondary,
    radius: 5,
    border: false,
    onChangeText: null,
};
SearchBar.propTypes = {
    onChangeText: PropTypes.func,
    placeHolder: PropTypes.string,
    backgroundColor: PropTypes.string,
    innerBackground: PropTypes.string,
    radius: PropTypes.number,
    borderColor: PropTypes.string,
    border: PropTypes.bool,
    iconColor: PropTypes.string,
};

