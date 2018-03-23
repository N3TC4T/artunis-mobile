/* eslint-disable react-native/no-unused-styles */
import PropTypes from 'prop-types';
import React, { PureComponent, Children } from 'react';
import { View, ScrollView, Animated, Platform, ViewPropTypes, StyleSheet } from 'react-native';

import Indicator from './PageIndicator.ui';

// eslint-disable-next-line no-restricted-properties
const floatEpsilon = Math.pow(2, -23);

function equal(a, b) {
    return Math.abs(a - b) <= floatEpsilon * Math.max(Math.abs(a), Math.abs(b));
}


const styles = StyleSheet.create({
    rtl: {
        transform: [
            {
                rotate: '180deg',
            },
        ],
    },
    container: {
        flex: 1,
    },
    bottom: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        left: 0,
    },
    top: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
    },
    left: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
    },
    right: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
    },
});

export default class Pages extends PureComponent {
    static defaultProps = {
        pagingEnabled: true,
        showsHorizontalScrollIndicator: false,
        showsVerticalScrollIndicator: false,
        scrollEventThrottle: 30,
        scrollsToTop: false,

        indicatorColor: 'rgb(255, 255, 255)',
        indicatorOpacity: 0.3,

        startPage: 0,

        horizontal: true,
        rtl: false,
    };

    static propTypes = {
        style: ViewPropTypes.style,
        containerStyle: ViewPropTypes.style,

        indicatorColor: PropTypes.string,
        indicatorOpacity: PropTypes.number,
        indicatorPosition: PropTypes.oneOf(['none', 'top', 'right', 'bottom', 'left']),

        startPage: PropTypes.number,
        progress: PropTypes.instanceOf(Animated.Value),

        horizontal: PropTypes.bool,
        rtl: PropTypes.bool,

        children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),

        onLayout: PropTypes.func,
        onScrollEnd: PropTypes.func,
        renderPager: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.onLayout = this.onLayout.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.onScrollBeginDrag = this.onScrollBeginDrag.bind(this);
        this.onScrollEndDrag = this.onScrollEndDrag.bind(this);

        this.updateRef = this.updateRef.bind(this, 'scroll');
        this.renderPage = this.renderPage.bind(this);

        const { startPage, progress = new Animated.Value(startPage) } = this.props;

        this.progress = startPage;
        this.mounted = false;
        this.scrollState = -1;

        this.state = {
            width: 0,
            height: 0,
            progress,
        };
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentDidUpdate() {
        if (this.scrollState === -1) {
            /* Fix scroll position after layout update */
            requestAnimationFrame(() => {
                this.scrollToPage(Math.floor(this.progress), false);
            });
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    componentWillReceiveProps(props) {
        const { progress } = props;

        if (progress !== this.props.progress) {
            progress.setValue(this.progress);

            this.setState({ progress });
        }
    }

    updateRef(name, ref) {
        this[name] = ref;
    }

    onLayout(event) {
        const { width, height } = event.nativeEvent.layout;
        const { onLayout } = this.props;

        if (typeof onLayout === 'function') {
            onLayout(event);
        }

        this.setState({ width, height });
    }

    onScroll(event) {
        if (this.scrollState === -1) {
            return;
        }

        const { horizontal } = this.props;
        const { [horizontal ? 'x' : 'y']: offset } = event.nativeEvent.contentOffset;
        const { [horizontal ? 'width' : 'height']: base, progress } = this.state;

        progress.setValue((this.progress = base ? offset / base : 0));

        const discreteProgress = Math.round(this.progress);

        if (this.scrollState === 1 && equal(discreteProgress, this.progress)) {
            this.onScrollEnd();

            this.scrollState = -1;
        }
    }

    onScrollBeginDrag() {
        this.scrollState = 0;
    }

    onScrollEndDrag() {
        const { horizontal } = this.props;

        /* Vertical pagination is not working on android, scroll by hands */
        if (Platform.OS === 'android' && !horizontal) {
            this.scrollToPage(Math.round(this.progress));
        }

        this.scrollState = 1;
    }

    onScrollEnd() {
        const { onScrollEnd } = this.props;

        if (typeof onScrollEnd === 'function') {
            onScrollEnd(Math.round(this.progress));
        }
    }

    scrollToPage = (page, animated = true) => {
        const { horizontal } = this.props;
        const { [horizontal ? 'width' : 'height']: base } = this.state;

        if (animated) {
            this.scrollState = 1;
        }

        if (this.mounted && this.scroll) {
            this.scroll.scrollTo({
                [horizontal ? 'x' : 'y']: page * base,
                animated,
            });
        }
    };

    isDragging() {
        return this.scrollState === 0;
    }

    isDecelerating() {
        return this.scrollState === 1;
    }

    renderPage(page, index) {
        const { width, height } = this.state;
        let { progress } = this.state;
        const { children, horizontal, rtl } = this.props;

        const pages = Children.count(children);

        const pageStyle = horizontal && rtl ? styles.rtl : null;

        /* Adjust progress by page index */
        progress = Animated.add(progress, -index);

        return (
            <View style={[{ width, height }, pageStyle]}>{React.cloneElement(page, { index, pages, progress })}</View>
        );
    }

    renderPager(pager) {
        const { renderPager, horizontal, rtl } = this.props;

        if (typeof renderPager === 'function') {
            return renderPager({ horizontal, rtl, ...pager });
        }

        const { indicatorPosition } = pager;

        if (indicatorPosition === 'none') {
            return null;
        }

        const indicatorStyle = horizontal && rtl ? styles.rtl : null;

        return (
            <View style={[styles[indicatorPosition], indicatorStyle]}>
                <Indicator {...pager} scrollTo={this.scrollToPage} />
            </View>
        );
    }

    render() {
        const { progress } = this.state;
        const { horizontal, rtl } = this.props;
        const {
            style,
            containerStyle,
            children,
            indicatorColor,
            indicatorOpacity,
            indicatorPosition = horizontal ? 'bottom' : 'right',
            ...props
        } = this.props;

        const pages = Children.count(children);

        const Pager = () =>
            this.renderPager({
                pages,
                progress,
                indicatorColor,
                indicatorOpacity,
                indicatorPosition,
            });

        const scrollStyle = horizontal && rtl ? styles.rtl : null;

        return (
            <View style={[styles.container, containerStyle]}>
                <ScrollView
                    {...props}
                    style={[styles.container, style, scrollStyle]}
                    onLayout={this.onLayout}
                    onScroll={this.onScroll}
                    onScrollBeginDrag={this.onScrollBeginDrag}
                    onScrollEndDrag={this.onScrollEndDrag}
                    ref={this.updateRef}
                >
                    {Children.map(children, this.renderPage)}
                </ScrollView>

                <Pager />
            </View>
        );
    }
}

