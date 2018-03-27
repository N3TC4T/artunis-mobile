/**
 * Redux Action Types
 */

export default {
    ROOT_CHANGED: 'app.core.ROOT_CHANGED',
    RESET_STATE: 'app.core.RESET',
    INITIALIZE_STATE: 'app.core.INITIALIZE',
    CORE_INITIALIZED: 'app.core.SETUP_CORE',
    CONNECT: 'app.core.CONNECT',
    DISCONNECT: 'app.core.DISCONNECT',
    CONNECTED: 'app.core.CONNECTED',
    DISCONNECTED: 'app.core.DISCONNECTED',
    SET_SCAN_RESULT: 'app.core.SET_SCAN_RESULT',
    CLEAR_SCAN_RESULT: 'app.core.CLEAR_SCAN_RESULT',

    CONNECT_MARKET_SOCKET: 'app.core.CONNECT_MARKET_SOCKET',
    SET_MARKET_PRICE: 'app.core.SET_MARKET_PRICE',

    SET_ACCOUNT: 'app.account.SET_ACCOUNT',
    UPDATE_ACCOUNT: 'app.account.UPDATE_ACCOUNT',

    SET_CONTACT: 'app.contact.SET_CONTACT',
};
