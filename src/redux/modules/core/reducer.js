import { ActionTypes } from '@constants/';

import { Map, fromJS } from 'immutable';

// Initial state
const initialState = Map({
    root: undefined,
    isReady: false,
    initialized: false,
    requiredPin: false,
    offline: false,
    connected: false,
    maxFee: '0.15',
    maxLedgerVersionOffset: 50,
    marketPrice: Map({}),
    scanResult: Map({}),
    ledgerVersion: 0,
});

// Reducer
export default function coreStateReducer(state = initialState, action = {}) {
    switch (action.type) {
        case ActionTypes.INITIALIZE_STATE:
        case ActionTypes.RESET_STATE:
            return state.set('isReady', true);
        case ActionTypes.ROOT_CHANGED:
            return state.set('root', action.root);
        case ActionTypes.CORE_INITIALIZED:
            return state.set('initialized', true);
        case ActionTypes.CONNECTED:
            return state.set('connected', true);
        case ActionTypes.DISCONNECTED:
            return state.set('connected', false);
        case ActionTypes.SET_MARKET_PRICE:
            return state.set('marketPrice', fromJS(action.payload));
        case ActionTypes.SET_SCAN_RESULT:
            return state.set('scanResult', fromJS(action.payload));
        default:
            return state;
    }
}
