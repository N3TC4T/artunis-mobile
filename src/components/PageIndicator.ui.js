import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { View, Animated, ViewPropTypes, StyleSheet, Text, TouchableOpacity } from 'react-native';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(6,56,82, 0.5)',
        height: 45,
        alignItems: 'center',
        flexDirection: 'row',
    },
    leftContent: {
        flex: 1,
        paddingLeft: 15,
        alignItems: 'flex-start',
    },
    rightContent: {
        flex: 1,
        paddingRight: 15,
        alignItems: 'flex-end',
    },
    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    dot: {
        backgroundColor: 'white',
        borderRadius: 4,
        width: 8,
        height: 8,
        margin: 4,
    },
    nextDisabled: {
        color: 'grey',
    },
    nextActive: {
        color: 'white',
    },
    skipText: {
        color: '#FFF',
    },
});


export default class Indicator extends PureComponent {
    static propTypes = {
        style: ViewPropTypes.style,
        pages: PropTypes.number.isRequired,
        progress: PropTypes.instanceOf(Animated.Value).isRequired,
        indicatorColor: PropTypes.string.isRequired,
        indicatorOpacity: PropTypes.number.isRequired,
    };

    constructor(props) {
        super(props);
        this.currentIndex = 1;
        this.skipButtonVisibility = new Animated.Value(1);
    }

    componentDidMount() {
        const { progress, pages } = this.props;
        progress.addListener(obj => {
            if (this.currentIndex !== Math.floor(obj.value) + 1) {
                this.currentIndex = Math.floor(obj.value) + 1;

                // hide skip button
                if (this.currentIndex >= pages) {
                    Animated.timing(this.skipButtonVisibility, {
                        toValue: 0,
                        duration: 300,
                    }).start();
                } else {
                    Animated.timing(this.skipButtonVisibility, {
                        toValue: 1,
                        duration: 300,
                    }).start();
                }

                this.forceUpdate();
            }
        });
    }

    componentWillUnmount() {
        const { progress } = this.props;
        progress.removeAllListeners();
    }

    renderNextButton = () => {
        const { pages } = this.props;
        if (this.currentIndex < pages) {
            return (
                <TouchableOpacity
                    onPress={() => {
                        this.props.scrollTo(this.currentIndex);
                    }}
                >
                    <Text style={styles.nextActive}>Next</Text>
                </TouchableOpacity>
            );
        }
        return (
            <TouchableOpacity>
                <Text style={styles.nextDisabled}>Next</Text>
            </TouchableOpacity>
        );
    };

    renderSkipButton = () => {
        const { pages } = this.props;

        const containerStyle = {
            opacity: this.skipButtonVisibility.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
            }),
            transform: [
                {
                    scale: this.skipButtonVisibility.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1.1, 1],
                    }),
                },
            ],
        };

        return (
            <Animated.View style={containerStyle}>
                <TouchableOpacity
                    onPress={() => {
                        this.props.scrollTo(pages);
                    }}
                >
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    render() {
        const { pages, progress, indicatorColor: backgroundColor, indicatorOpacity, style, ...props } = this.props;

        const dots = Array.from(new Array(pages), (page, index) => {
            const opacity = progress.interpolate({
                inputRange: [-Infinity, index - 1, index, index + 1, Infinity],
                outputRange: [indicatorOpacity, indicatorOpacity, 1.0, indicatorOpacity, indicatorOpacity],
            });

            const viewStyle = { opacity, backgroundColor };

            return <Animated.View style={[styles.dot, viewStyle]} key={index} />;
        });

        return (
            <View style={[styles.container, style]} {...props}>
                <View style={styles.leftContent}>{this.renderSkipButton()}</View>
                <View style={styles.centerContent}>{dots}</View>

                <View style={styles.rightContent}>{this.renderNextButton()}</View>
            </View>
        );
    }
}

