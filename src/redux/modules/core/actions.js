import { ActionTypes } from '@constants/';

import { Vault } from '@libs/vault';

export const boot = () => (dispatch, getState) => {
    const coreState = getState().get('core');
    const initialized = coreState.get('initialized');
    const requiredPin = coreState.get('requiredPin');
    // check if user has wallet show login
    // no show splash
    let root = 'splash';

    if (initialized) {
        if (requiredPin) {
            root = 'login';
        } else {
            root = 'after-login';
            dispatch({
                type: ActionTypes.CONNECT,
            });

            dispatch({
                type: ActionTypes.CONNECT_MARKET_SOCKET,
            });
        }
    }

    return dispatch({
        type: ActionTypes.ROOT_CHANGED,
        root,
    });
};

export const resetSessionStateFromSnapshot = state => ({
    type: ActionTypes.RESET_STATE,
    payload: state,
});

export const initializeSessionState = () => ({
    type: ActionTypes.INITIALIZE_STATE,
});

export const initialize = (paperKeys, password) => async dispatch => {
    await Vault.create(paperKeys, password).then(() =>
        dispatch({
            type: ActionTypes.CORE_INITIALIZED,
        }),
    );
};

export const connected = () => ({
    type: ActionTypes.CONNECTED,
});

export const disconnected = () => ({
    type: ActionTypes.DISCONNECTED,
});

export const setMarketPrice = data => ({
    type: ActionTypes.SET_MARKET_PRICE,
    payload: data,
});

export const setScanResult = result => ({
    type: ActionTypes.SET_SCAN_RESULT,
    payload: result,
});
