/* eslint-disable */
// Todo: Fix Me
import React, { Component } from 'react';
import { StyleSheet, View, PanResponder, Animated } from 'react-native';

import PropTypes from 'prop-types';

import { AppSizes } from '@theme/';

const SLIDE_DIRECTION = {
    LEFT: 'left',
    RIGHT: 'right',
    BOTH: 'both',
};


const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    button: {
        position: 'absolute',
    },
});


export default class SlideButton extends Component {
    constructor(props) {
        super(props);
        this.buttonWidth = 0;
        this.state = {
            initialX: 0,
            locationX: 0,
            dx: 0,
            animatedX: new Animated.Value(0),
            released: false,
            swiped: true,
        };
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    /* Button movement of > 40% is considered a successful slide by default */
    isSlideSuccessful = () => {
        const slidePercent = this.props.successfulSlidePercent;
        const successfulSlideWidth = this.buttonWidth * slidePercent / 100;
        if (!this.props.slideDirection) {
            return this.state.dx > successfulSlideWidth; // Defaults to right slide
        } else if (this.props.slideDirection === SLIDE_DIRECTION.RIGHT) {
            return this.state.dx > successfulSlideWidth;
        } else if (this.props.slideDirection === SLIDE_DIRECTION.LEFT) {
            return this.state.dx < -1 * successfulSlideWidth;
        } else if (this.props.slideDirection === SLIDE_DIRECTION.BOTH) {
            return Math.abs(this.state.dx) > successfulSlideWidth;
        }
    };

    componentWillMount() {
        this.mounted = false;
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gestureState) => {},

            onPanResponderMove: (evt, gestureState) => {
                this.setState({
                    locationX: evt.nativeEvent.locationX,
                    dx: gestureState.dx,
                });
            },

            onPanResponderRelease: (evt, gestureState) => {
                if (this.isSlideSuccessful()) {
                    // Move the button out
                    this.moveButtonOut(() => {
                        this.setState({ swiped: true });
                        this.props.onSlideSuccess();
                    });

                    // Slide it back in after 1 sec
                    setTimeout(() => {
                        if (this.mounted) {
                            this.moveButtonIn(() => {
                                this.setState({
                                    released: false,
                                    dx: this.state.initialX,
                                });
                            });
                        }
                    }, 1000);
                } else {
                    this.snapToPosition(() => {
                        this.setState({
                            released: false,
                            dx: this.state.initialX,
                        });
                    });
                }
            },

            onPanResponderTerminate: (evt, gestureState) => {
                // Another component has become the responder, so this gesture
                // should be cancelled
                this.snapToPosition(() => {
                    this.setState({
                        released: false,
                        dx: this.state.initialX,
                    });
                });
            },

            onShouldBlockNativeResponder: (evt, gestureState) =>
                // Returns whether this component should block native components from
                // becoming the JS responder. Returns true by default. Is currently only
                // supported on android.
                true,
        });
    }

    onSlideSuccess() {
        const { onSlideSuccess } = this.props;
        if (onSlideSuccess) {
            onSlideSuccess();
        }
    }

    moveButtonIn(onCompleteCallback) {
        const startPos =
            this.state.dx < 0 ? this.state.initialX + this.buttonWidth : this.state.initialX - this.buttonWidth;
        const endPos = this.state.initialX;

        this.setState(
            {
                released: true,
                animatedX: new Animated.Value(startPos),
            },
            () => {
                Animated.timing(this.state.animatedX, { toValue: endPos }).start(onCompleteCallback);
            },
        );
    }

    moveButtonOut(onCompleteCallback) {
        const startPos = this.state.initialX + this.state.dx;
        const endPos = this.state.dx < 0 ? -this.buttonWidth : this.buttonWidth * 2;

        this.setState(
            {
                released: true,
                animatedX: new Animated.Value(startPos),
            },
            () => {
                Animated.timing(this.state.animatedX, { toValue: endPos }).start(onCompleteCallback);
            },
        );
    }

    snapToPosition(onCompleteCallback) {
        const startPos = this.state.initialX + this.state.dx;
        const endPos = this.state.initialX;

        this.setState(
            {
                released: true,
                animatedX: new Animated.Value(startPos),
            },
            () => {
                Animated.timing(this.state.animatedX, { toValue: endPos }).start(onCompleteCallback);
            },
        );
    }

    onLayout(event) {
        this.buttonWidth = event.nativeEvent.layout.width;
        this.setState({
            initialX: event.nativeEvent.layout.x,
        });
    }

    render() {
        let style = [styles.button, this.props.style, { left: this.state.dx }];
        let button = null;

        if (this.state.released) {
            style = [styles.button, this.props.style, { left: this.state.animatedX }];
            button = <Animated.View style={style}>{this.props.children}</Animated.View>;
        } else {
            button = (
                <View style={style}>
                    <View onLayout={this.onLayout.bind(this)}>{this.props.children}</View>
                </View>
            );
        }

        return (
            <View
                style={{
                    width: this.props.width,
                    height: this.props.height,
                    overflow: 'hidden',
                }}
            >
                <View style={styles.container} {...this.panResponder.panHandlers}>
                    {button}
                </View>
            </View>
        );
    }
}

SlideButton.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    onSlideSuccess: PropTypes.func,
    slideDirection: PropTypes.string,
    successfulSlidePercent: PropTypes.number,
};

SlideButton.defaultProps = {
    width: AppSizes.screen.width,
    height: AppSizes.screen.height * 0.2,
    slideDirection: SLIDE_DIRECTION.RIGHT,
    successfulSlidePercent: 60,
};
