import { AsyncStorage } from 'react-native';
import { fromJS } from 'immutable';

import { Storage } from '@libs/crypto';

const STATE_STORAGE_KEY = 'rippleWallet:Latest';

/**
 * Reads state object from async storage
 *
 * @returns {Promise}
 */
async function rehydrate() {
    try {
        const plain = await AsyncStorage.getItem(STATE_STORAGE_KEY);
        const state = await Storage.decrypt(plain);
        return state ? JSON.parse(state) : null;
    } catch (e) {
        console.error('Error reading persisted application state', e);
        return null;
    }
}


/**
 * Saves provided state object to async storage
 *
 * @returns {Promise}
 */
async function persist(state) {
    try {
        const data = await Storage.encrypt(JSON.stringify(state));
        await AsyncStorage.setItem(STATE_STORAGE_KEY, data);
    } catch (e) {
        console.error('Error persisting application state', e);
    }
}


async function clear() {
    try {
        await AsyncStorage.removeItem(STATE_STORAGE_KEY);
    } catch (e) {
        console.error('Error clearing persisted application state', e);
    }
}


export async function resetSnapshot() {
    const state = await rehydrate();
    if (state) {
        return fromJS(state);
    }

    return null;
}

export async function saveSnapshot(state) {
    await persist(state.toJS());
}

export async function clearSnapshot() {
    await clear();
}
