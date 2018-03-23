// @flow
/* eslint-disable react-native/no-inline-styles */
// Todo: Fix eslint

/**
 * Contacts Screen
 *  - Shows contacts list
 */
import React, { Component } from 'react';
// import PropTypes from 'prop-types';

import _ from 'lodash';

import { View, Text, StyleSheet, Image, TouchableHighlight, ListView } from 'react-native';

// Consts and Libs
import { AppStyles, AppColors, AppFonts } from '@theme/';

import { SearchBar, Error } from '@components/';

/* Component ==================================================================== */
const styles = StyleSheet.create({
    avatar: {
        width: 38,
        height: 38,
        marginRight: 10,
        tintColor: '#FFF',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 8,
    },
    name: {
        fontSize: 16,
        fontWeight: '500',
        color: AppColors.textPrimary,
    },
    address: {
        fontSize: 11,
        color: AppColors.textSecondary,
    },
    sectionHeaderText: {
        fontFamily: AppFonts.familyBold,
        fontWeight: '700',
        paddingLeft: 8,
        color: '#478FD5',
    },
});

/* Component ==================================================================== */
class ContactsView extends Component {
    static componentName = 'ContactsView';

    static navigatorStyle = {
        navBarButtonColor: '#FFFFFF',
    };

    constructor(props) {
        super(props);

        this.ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
        });

        this.state = {
            dataSource: this.ds.cloneWithRowsAndSections(this.convertContactsArrayToMap()),
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.contacts !== this.props.contacts) {
            this.setState({
                dataSource: this.ds.cloneWithRowsAndSections(this.convertContactsArrayToMap(nextProps.contacts)),
            });
        }
    }

    convertContactsArrayToMap = (contacts = this.props.contacts) => {
        const contactsCategoryMap = {};
        contacts.forEach(item => {
            const firstLetter = item.name.charAt(0).toUpperCase();
            if (!contactsCategoryMap[firstLetter]) {
                contactsCategoryMap[firstLetter] = [];
            }

            contactsCategoryMap[firstLetter].push(item);
        });

        // Sort
        return _(contactsCategoryMap)
            .toPairs()
            .sortBy(0)
            .fromPairs()
            .value();
    };

    onItemPress = () => {
        console.warn('Not Implemented Yet.');
    };

    onAddPress = () => {
        this.props.navigator.showModal({
            screen: 'app.Contacts.AddContact',
            title: 'Add new contact',
            animationType: 'fade',
        });
    };

    onSearchChange = text => {
        const { contacts } = this.props;

        const newFilter = [];

        contacts.forEach(item => {
            if (item.name.toLowerCase().indexOf(text) !== -1) {
                newFilter.push(item);
            }
        });

        this.setState({
            dataSource: this.ds.cloneWithRowsAndSections(this.convertContactsArrayToMap(newFilter)),
        });
    };

    renderSectionHeader = (sectionData, category) => <Text style={styles.sectionHeaderText}>{category}</Text>;

    renderRow = item => (
        <TouchableHighlight
            onPress={() => {
                this.onItemPress(item);
            }}
            underlayColor="rgba(154, 154, 154, 0.25)"
        >
            <View style={styles.row}>
                <Image style={styles.avatar} source={require('../../assets/icons/icons8-male-user2-64.png')} />
                <View>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.address}>{item.address}</Text>
                </View>
            </View>
        </TouchableHighlight>
    );

    render() {
        const { dataSource } = this.state;

        return (
            <View style={[AppStyles.container]}>
                <View style={[AppStyles.row]}>
                    <View style={[AppStyles.flex6]}>
                        <SearchBar
                            lightTheme
                            onChangeText={this.onSearchChange}
                            inputStyle={{ height: 38 }}
                            containerStyle={{ backgroundColor: 'transparent' }}
                            placeHolder="Search contacts"
                        />
                    </View>
                    <TouchableHighlight onPress={this.onAddPress} style={[AppStyles.flex1, AppStyles.centerAligned]}>
                        <Image
                            source={require('../../assets/icons/icons8-plus-math-64.png')}
                            style={{ tintColor: '#0896d6', width: 25, height: 25 }}
                        />
                    </TouchableHighlight>
                </View>

                {dataSource.getRowCount() < 1 ? (
                    <Error text="No Contact" />
                ) : (
                    <View style={AppStyles.paddingTop}>
                        <ListView
                            dataSource={this.state.dataSource}
                            renderRow={this.renderRow}
                            renderSectionHeader={this.renderSectionHeader}
                        />
                    </View>
                )}
            </View>
        );
    }
}


/* Export Component ==================================================================== */
export default ContactsView;
