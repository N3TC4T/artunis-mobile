import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { View, Text, StyleSheet, FlatList } from 'react-native';

// Const and Libs
import { AppStyles, AppColors, AppSizes, AppFonts } from '@theme/';

// Components
import { Button } from '@components/';

/* Styles  ==================================================================== */
const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: AppSizes.screen.width,
        height: AppSizes.screen.width * 0.8,
    },
    box: {
        width: AppSizes.screen.width * 0.5,
        height: AppSizes.screen.width * 0.3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: AppColors.brand.secondary,
    },
    boxText: {
        fontSize: 30,
        color: AppColors.textPrimary,
        fontFamily: AppFonts.base.familyBold,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    buttonText: {
        color: AppColors.textPrimary,
        fontSize: 20,
        fontFamily: AppFonts.base.family,
    },
    buttonContainer: {
        marginRight: 5,
    },
});

/* Component ==================================================================== */
class PaperKeySlider extends Component {
    static componentName = 'PaperKeySlider';

    static propTypes = {
        // eslint-disable-next-line react/forbid-prop-types
        keys: PropTypes.array.isRequired,
        onListEnd: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            currentPaperIndex: 0,
        };
    }

    renderItem = obj => (
        <View style={styles.row}>
            <View style={styles.box}>
                <Text style={styles.boxText}>{obj.item}</Text>
            </View>
        </View>
    );

    moveItem = direction => {
        const { currentPaperIndex } = this.state;
        const { keys, onListEnd } = this.props;

        if (currentPaperIndex === keys.length - 1 && direction !== 'left') {
            onListEnd();
            return null;
        }

        switch (direction) {
            case 'left':
                this.listRef.scrollToIndex({ index: currentPaperIndex - 1 });
                return this.setState({
                    currentPaperIndex: currentPaperIndex - 1,
                });
            case 'right':
            default:
                this.listRef.scrollToIndex({ index: currentPaperIndex + 1 });
                return this.setState({
                    currentPaperIndex: currentPaperIndex + 1,
                });
        }
    };

    render() {
        const { currentPaperIndex } = this.state;
        const { keys } = this.props;
        return (
            <View style={[AppStyles.container]}>
                <View style={[AppStyles.row, AppStyles.padding]}>
                    <Text style={AppStyles.baseText}>Write down each word in order and store it in a safe place.</Text>
                </View>

                <FlatList
                    ref={flatList => { this.listRef = flatList; }}
                    data={keys}
                    horizontal
                    pagingEnabled
                    renderItem={this.renderItem}
                    showsHorizontalScrollIndicator={false}
                    removeClippedSubviews={false}
                    scrollEnabled={false}
                    keyExtractor={(item, index) => index}
                />

                <View style={[AppStyles.centerAligned, AppStyles.paddingVertical]}>
                    <Text style={AppStyles.baseText}>
                        {currentPaperIndex + 1} of {keys.length}
                    </Text>
                </View>

                <View style={[styles.actions, AppStyles.padding]}>
                    <View style={[AppStyles.flex1, styles.buttonContainer]}>
                        <Button
                            style={AppStyles.secondaryButtonStyle}
                            textStyle={styles.buttonText}
                            activeOpacity={1}
                            isDisabled={currentPaperIndex === 0}
                            onPress={() => this.moveItem('left')}
                        >
                            Previous
                        </Button>
                    </View>
                    <View style={[AppStyles.flex1, styles.buttonContainer]}>
                        <Button
                            style={AppStyles.secondaryButtonStyle}
                            textStyle={styles.buttonText}
                            activeOpacity={1}
                            onPress={() => this.moveItem('right')}
                        >
                            Next
                        </Button>
                    </View>
                </View>
            </View>
        );
    }
}


/* Export Component ==================================================================== */
export default PaperKeySlider;
