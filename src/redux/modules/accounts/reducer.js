import { ActionTypes } from '@constants/';

import { Map } from 'immutable';

// Initial state
const initialState = Map({});

// Reducer
export default function accountStateReducer(state = initialState, action = {}) {
    switch (action.type) {
        case ActionTypes.SET_ACCOUNT: {
            const account = Map({
                balance: 0,
                ...action.payload,
            });
            return state.set(action.payload.address, account);
        }
        case ActionTypes.UPDATE_ACCOUNT:
            return state.setIn([action.payload.account, action.payload.key], action.payload[action.payload.key]);
        default:
            return state;
    }
}
