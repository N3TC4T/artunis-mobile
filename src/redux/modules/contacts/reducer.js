import { ActionTypes } from '@constants/';

import { List, Map } from 'immutable';

// Initial state
const initialState = List();

// Reducer
export default function contactStateReducer(state = initialState, action = {}) {
    switch (action.type) {
        case ActionTypes.SET_CONTACT: {
            return state.push(Map(action.payload));
        }
        default:
            return state;
    }
}
