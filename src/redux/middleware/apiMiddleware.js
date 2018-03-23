import _ from 'lodash';

// Ripple libs
import { RippleAPI } from 'ripple-lib';

import { AppState } from 'react-native';

// Actions
import * as coreActions from '@redux/modules/core/actions/';
import * as accountsActions from '@redux/modules/accounts/actions/';

// Constants
import { ActionTypes, AppConfig } from '@constants/';

import { ConnectionStatus } from '@components/';
import { getBalance } from '@libs/ripple/';

import { NotificationsAndroid } from 'react-native-notifications';

const apiMiddleware = (() => {
    let api = null;

    const onConnect = store => {
        // set api as global variable so we can use in everywhere
        global.api = api;
        // Tell user we connected to ripple network
        ConnectionStatus.show('connected');
        // Tell the store we're connected
        store.dispatch(coreActions.connected());

        // init stuff
        const accounts = store
            .getState()
            .get('accounts')
            .toJS();

        // get balance for all accounts
        _.mapKeys(accounts, (value, key) => {
            getBalance(key)
                .then(balance => {
                    store.dispatch(accountsActions.updateBalance(key, parseFloat(_.get(balance, '[0].value', 0))));
                })
                .catch(error => {
                    console.warn(error);
                });
        });

        // subscribe all accounts for new events
        const subscriptions = _.keys(accounts);
        api.connection.request({
            command: 'subscribe',
            accounts: subscriptions,
        });

        // Subscribe for new transactions
        api.connection.on('transaction', ev => {
            const { transaction } = ev;
            // Show notification for income transactions on background state
            if (_.includes(subscriptions, transaction.Destination)) {
                if (AppState.currentState === 'background') {
                    NotificationsAndroid.localNotification({
                        title: 'Incoming Transaction',
                        silent: false,
                        body: `Received ${transaction.Amount / 1000000} XRP from ${transaction.Account}`,
                    });
                }
            }

            // Update Balances
            _.map([transaction.Account, transaction.Destination], account => {
                if (_.includes(subscriptions, account)) {
                    getBalance(account).then(balance => {
                        store.dispatch(
                            accountsActions.updateBalance(account, parseFloat(_.get(balance, '[0].value', 0))),
                        );
                    });
                }
            });
        });
    };

    const onDisconnect = (code, store) => () => {
        ConnectionStatus.show('disconnected');
        // Tell the store we've disconnected
        store.dispatch(coreActions.disconnected());
    };

    return store => next => action => {
        switch (action.type) {
            case ActionTypes.CONNECT:
                // TODO: this is not working and should fixed
                // ConnectionStatus.show('connecting');

                // Start a new connection to the server
                if (api !== null) {
                    api.disconnect();
                }

                api = new RippleAPI({ server: AppConfig.urls.ws });

                api.connect().then(() => {
                    onConnect(store);
                });

                api.on('disconnected', code => {
                    onDisconnect(code, store);
                });

                break;

            // The user wants us to disconnect
            case ActionTypes.DISCONNECT:
                if (api !== null) {
                    api.disconnect();
                }
                api = null;
                global.api = null;

                // Set our state to disconnected
                store.dispatch(coreActions.disconnected());

                break;

            // This action is irrelevant to us, pass it on to the next middleware
            default:
                return next(action);
        }

        return next(action);
    };
})();

export default apiMiddleware;
