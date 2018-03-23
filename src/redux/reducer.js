/* eslint-disable no-void */
/**
 * Combine All Reducers
 */

import { loop, combineReducers } from 'redux-loop-symbol-ponyfill';
import { Map, fromJS } from 'immutable';

import coreStateReducer from '@redux/modules/core/reducer';
import accountsStateReducer from '@redux/modules/accounts/reducer';
import contactsStateReducer from '@redux/modules/contacts/reducer';

import { ActionTypes } from '@constants/';

const reducers = {
    core: coreStateReducer,
    accounts: accountsStateReducer,
    contacts: contactsStateReducer,
};

// initial state, accessor and mutator for supporting root-level
// immutable data with redux-loop reducer combinator
const immutableStateContainer = Map();
const getImmutable = (child, key) => (child ? child.get(key) : void 0);
const setImmutable = (child, key, value) => child.set(key, value);

const appReducer = combineReducers(reducers, immutableStateContainer, getImmutable, setImmutable);

// Setup root reducer
const rootReducer = (state, action) => {
    const [nextState, effects] =
        action.type === ActionTypes.RESET_STATE
            ? appReducer(action.payload, action)
            : appReducer(state || void 0, action);

    // enforce the state is immutable
    return loop(fromJS(nextState), effects);
};

export default rootReducer;
