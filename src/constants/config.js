/**
 * Global App Config
 */
/* global __DEV__ */

export default {
    // App Details
    appName: 'XRP Wallet',

    // Build Configuration - eg. Debug or Release?
    DEV: __DEV__,

    storageKey: 'rippleWallet:Latest',

    // URLs
    urls: {
        github: 'https://github.com/n3tc4t',
        // ws: 'wss://s2.ripple.com:443',
        ws: 'wss://s.altnet.rippletest.net:51233', // Test Net
        price_ws: 'https://streamer.cryptocompare.com/',
    },
};
