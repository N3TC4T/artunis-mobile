// redux lib
import { applyMiddleware, compose, createStore } from 'redux';
import * as reduxLoop from 'redux-loop-symbol-ponyfill';
// redux tools
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-promise';

import { marketPriceMiddleware, apiMiddleware, loggerMiddleware } from '@redux/middleware/';

import rootReducer from '@redux/reducer/';

// Load middleware
let middleware = [marketPriceMiddleware, apiMiddleware, promiseMiddleware, thunkMiddleware];

if (__DEV__) {
    // Dev-only middleware
    middleware = [...middleware, loggerMiddleware];
}

const enhancers = [applyMiddleware(...middleware), reduxLoop.install()];

/* Enable redux dev tools only in development.
 * We suggest using the standalone React Native Debugger extension:
 * https://github.com/jhen0409/react-native-debugger
 */
/* eslint-disable no-undef */
const composeEnhancers =
    // eslint-disable-next-line no-underscore-dangle
    (__DEV__ && typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
/* eslint-enable no-undef */

const enhancer = composeEnhancers(...enhancers);

// create the store
export default function configureStore() {
    return createStore(rootReducer, null, enhancer);
}
