/* eslint-disable */
import React, { Component } from 'react';
import { View, Animated, TouchableOpacity, ViewPropTypes, Platform, StatusBar } from 'react-native';

import PropTypes from 'prop-types';

import RootSiblings from 'react-native-root-siblings';

import { AppFonts, AppStyles } from '@theme/';

import { LoadingIndicator } from '@components/';

const BAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;
const SLIDE_DURATION = 300;
const ACTIVE_OPACITY = 0.6;
const SATURATION = 0.9;

const statusTypes = {
    CONNECTING: 'connecting',
    CONNECTED: 'connected',
    DISCONNECTED: 'disconnected',
};

const styles = {
    view: {
        height: BAR_HEIGHT,
        top: 0,
        right: 0,
        left: 0,
        position: 'absolute',
    },
    touchableOpacity: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    text: {
        height: BAR_HEIGHT,
        paddingTop: BAR_HEIGHT * 0.15,
        fontFamily: AppFonts.base.family,
        fontSize: 18,
        textAlign: 'center',
        color: 'white',
    },
};

function saturate(color, percent) {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);
    R = parseInt(R * percent);
    G = parseInt(G * percent);
    B = parseInt(B * percent);
    R = R < 255 ? R : 255;
    G = G < 255 ? G : 255;
    B = B < 255 ? B : 255;
    const r = R.toString(16).length === 1 ? `0${R.toString(16)}` : R.toString(16);
    const g = G.toString(16).length === 1 ? `0${G.toString(16)}` : G.toString(16);
    const b = B.toString(16).length === 1 ? `0${B.toString(16)}` : B.toString(16);
    return `#${r + g + b}`;
}

// Todo: Move component to another file
class AlertContainer extends Component {
    _animating = false;
    _root = null;
    _hideTimeout = null;
    _showTimeout = null;
    _duration = null;

    static propTypes = {
        ...ViewPropTypes,
        duration: PropTypes.number,
        delay: PropTypes.number,
        visible: PropTypes.bool,
        status: PropTypes.string,
    };

    static defaultProps = {
        visible: false,
    };

    constructor(props) {
        super(props);

        this.state = {
            visible: this.props.visible,
            height: new Animated.Value(0),
            opacity: new Animated.Value(0),
        };

        this._duration = this._getDuration();
    }

    componentDidMount() {
        if (this.state.visible) {
            this._showTimeout = setTimeout(() => this._show(), this.props.delay);
        }
    }

    componentWillReceiveProps = nextProps => {
        if (nextProps.visible !== this.props.visible) {
            if (nextProps.visible) {
                clearTimeout(this._showTimeout);
                clearTimeout(this._hideTimeout);
                this._showTimeout = setTimeout(() => this._show(), this.props.delay);
            } else {
                this._hide();
            }

            this.setState({
                visible: nextProps.visible,
            });
        }
    };

    componentWillUnmount() {
        this._hide();
    }

    shouldComponentUpdate = (nextProps, nextState) => this.state.visible !== nextState.visible;

    _getDuration = () => {
        const { status } = this.props;

        switch (status) {
            case statusTypes.CONNECTED:
            case statusTypes.DISCONNECTED:
                return 3500;
            case statusTypes.CONNECTING:
                return 0;
            default:
                return 0;
        }
    };

    _getColors = () => {
        const { status } = this.props;

        switch (status) {
            case statusTypes.CONNECTED:
                return {
                    BACKGROUND_COLOR: '#3CC29E',
                    TOUCHABLE_BACKGROUND_COLOR: '#59DC9A',
                };
            case statusTypes.CONNECTING:
                return {
                    BACKGROUND_COLOR: '#ffcc00',
                    TOUCHABLE_BACKGROUND_COLOR: '#ffcc00',
                };
            case statusTypes.DISCONNECTED:
                return {
                    BACKGROUND_COLOR: '#C02827',
                    TOUCHABLE_BACKGROUND_COLOR: '#FB6567',
                };
            default:
                return {
                    BACKGROUND_COLOR: '#3CC29E',
                    TOUCHABLE_BACKGROUND_COLOR: '#59DC9A',
                };
        }
    };

    _show = () => {
        clearTimeout(this._showTimeout);
        if (!this._animating) {
            clearTimeout(this._hideTimeout);
            this._animating = true;
            this._root.setNativeProps({
                pointerEvents: 'auto',
            });
            // requestAnimationFrame is a global function
            // eslint-disable-next-line no-undef
            requestAnimationFrame(() => {
                Animated.parallel([
                    Animated.timing(this.state.height, {
                        toValue: BAR_HEIGHT,
                        duration: SLIDE_DURATION,
                    }),
                    Animated.timing(this.state.opacity, {
                        toValue: 1,
                        duration: SLIDE_DURATION,
                    }),
                ]).start(({ finished }) => {
                    if (finished) {
                        this._animating = !finished;
                        if (this._duration > 0) {
                            this._hideTimeout = setTimeout(() => this._hide(), this._duration);
                        }
                    }
                });
            });
        }
    };

    _hide = () => {
        clearTimeout(this._showTimeout);
        clearTimeout(this._hideTimeout);
        if (!this._animating) {
            this._root.setNativeProps({
                pointerEvents: 'none',
            });

            // requestAnimationFrame is a global function
            // eslint-disable-next-line no-undef
            requestAnimationFrame(() => {
                Animated.parallel([
                    Animated.timing(this.state.height, {
                        toValue: 0,
                        duration: SLIDE_DURATION,
                    }),
                ]).start(({ finished }) => {
                    if (finished) {
                        this._animating = false;
                    }
                });
            });
        }
    };

    _renderContent = () => {
        const { status } = this.props;

        switch (status) {
            case statusTypes.CONNECTED:
                return (
                    <Animated.Text style={[styles.text]} allowFontScaling={false}>
                        Connected
                    </Animated.Text>
                );
            case statusTypes.DISCONNECTED:
                return (
                    <Animated.Text style={[styles.text]} allowFontScaling={false}>
                        Connected
                    </Animated.Text>
                );
            case statusTypes.CONNECTING:
                return (
                    <View style={[AppStyles.row, AppStyles.centerAligned]}>
                        <Animated.Text style={[styles.text]} allowFontScaling={false}>
                            Connecting
                        </Animated.Text>
                        <LoadingIndicator />
                    </View>
                );
            default:
                return null;
        }
    };

    render() {
        const { BACKGROUND_COLOR, TOUCHABLE_BACKGROUND_COLOR } = this._getColors();

        return this.state.visible || this._animating ? (
            <Animated.View
                style={[
                    styles.view,
                    {
                        height: this.state.height,
                        opacity: this.state.opacity,
                        backgroundColor: saturate(BACKGROUND_COLOR, SATURATION),
                    },
                ]}
                pointerEvents="none"
                ref={ele => {
                    this._root = ele;
                }}
            >
                <TouchableOpacity
                    style={[
                        styles.touchableOpacity,
                        {
                            backgroundColor: saturate(TOUCHABLE_BACKGROUND_COLOR, SATURATION),
                        },
                    ]}
                    onPress={this._hide}
                    activeOpacity={ACTIVE_OPACITY}
                >
                    {this._renderContent()}
                </TouchableOpacity>
            </Animated.View>
        ) : null;
    }
}

class Alert extends Component {
    static displayName = 'Alert';
    static propTypes = AlertContainer.propTypes;

    static show = status => new RootSiblings(<AlertContainer status={status} visible />);

    static hide = alert => {
        if (alert instanceof RootSiblings) {
            alert.destroy();
        } else {
            console.warn('Alert.hide expected a `RootSiblings` instance as argument.');
        }
    };

    componentWillMount() {
        this._alert = new RootSiblings(<AlertContainer {...this.props} duration={0} />);
    }

    componentWillReceiveProps = nextProps => {
        this._alert.update(<AlertContainer {...nextProps} duration={0} />);
    };

    componentWillUnmount() {
        this._alert.destroy();
    }

    _alert = null;

    render() {
        return null;
    }
}

export default Alert;
