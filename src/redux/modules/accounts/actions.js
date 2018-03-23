// @flow
import { Map } from 'immutable';

import { ActionTypes } from '@constants/';

import { Vault } from '@libs/vault';
import { getKeyPairsFromSeed } from '@libs/ripple';
import { Secret } from '@libs/crypto';

export const createWallet = (password: string) => async dispatch => {
    await Vault.open('seed', password).then((seed: Array<number>) => {
        const { address, publicKey } = getKeyPairsFromSeed(seed);
        return dispatch({
            type: ActionTypes.SET_ACCOUNT,
            payload: {
                label: 'Main Wallet',
                type: 'MAIN_WALLET',
                address,
                basic: Map({
                    publicKey,
                }),
            },
        });
    });
};

export const importWallet = (seed, data) => async dispatch => {
    const { address, publicKey, secret, label } = data;
    Secret.encrypt(secret, seed).then(encSecret => {
        // Set imported Account to store
        dispatch({
            type: ActionTypes.SET_ACCOUNT,
            payload: {
                address,
                label,
                type: 'IMPORTED_WALLET',
                basic: Map({
                    publicKey,
                    secret: encSecret,
                }),
            },
        });

        // Disconnect from server
        dispatch({
            type: ActionTypes.DISCONNECT,
        });

        // Reconnect and get balance and subscribe for new account
        return dispatch({
            type: ActionTypes.CONNECT,
        });
    });
};

export const updateBalance = (account, balance) => dispatch =>
    dispatch({
        type: ActionTypes.UPDATE_ACCOUNT,
        payload: {
            key: 'balance',
            account,
            balance,
        },
    });
