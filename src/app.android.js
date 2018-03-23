// @flow
import { Platform } from 'react-native';
import { Provider } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import * as snapshotUtil from '@libs/snapshot/';
import * as coreActions from '@redux/modules/core/actions/';

import configureStore from '@redux/store/';
import { AppStyles } from '@theme/';

import { registerScreens } from './screens';

const store = configureStore();

registerScreens(store, Provider);

const navigatorButtons = {
    leftButtons: [
        {
            icon: require('./assets/icons/menu.png'),
            id: 'menu',
        },
    ],
    rightButtons: [
        {
            icon: require('./assets/icons/icons8-qr-code-100.png'),
            id: 'scan',
        },
    ],
};

export default class App {
    constructor() {
        // check for snap shot
        // if there is any snapshot then restore it
        snapshotUtil.resetSnapshot().then(snapshot => {
            if (snapshot) {
                store.dispatch(coreActions.resetSessionStateFromSnapshot(snapshot));
            } else {
                store.dispatch(coreActions.initializeSessionState());
            }
            store.subscribe(() => {
                snapshotUtil.saveSnapshot(store.getState());
            });
            // in the end set app Initialized
            store.dispatch(coreActions.boot());
        });
        // subscribe for root change
        store.subscribe(this.onStoreUpdate.bind(this));
    }

    onStoreUpdate() {
        const coreState = store.getState().get('core');
        const root = coreState.get('root');
        const isReady = coreState.get('isReady');

        // handle a root change
        if (this.currentRoot !== root && isReady) {
            this.currentRoot = root;
            this.startApp(root);
        }
    }

    startApp(root: string) {
        switch (root) {
            case 'splash':
                Navigation.startSingleScreenApp({
                    screen: {
                        screen: 'app.Splash',
                    },
                });
                return;
            case 'login':
                Navigation.startSingleScreenApp({
                    screen: {
                        screen: 'app.Login',
                    },
                });
                return;
            case 'after-login':
                Navigation.startTabBasedApp({
                    tabs: [
                        {
                            label: 'Wallets',
                            screen: 'app.Wallets',
                            icon: require('./assets/icons/wallets.png'),
                            title: 'Portfolio',
                            navigatorButtons,
                        },
                        {
                            label: 'Receive',
                            screen: 'app.WalletReceive',
                            icon: require('./assets/icons/receive.png'),
                            title: 'Receive',
                        },
                        {
                            label: 'Send',
                            screen: 'app.WalletSend',
                            icon: require('./assets/icons/scan.png'),
                            title: 'Send',
                        },
                        {
                            label: 'Contacts',
                            screen: 'app.Contacts',
                            icon: require('./assets/icons/icons8-male-user-64.png'),
                            title: 'Contacts',
                        },
                    ],
                    animationType: Platform.OS === 'ios' ? 'slide-down' : 'fade',
                    appStyle: AppStyles.appStyle,
                    drawer: {
                        right: {
                            screen: 'app.Drawer',
                        },
                        animationType: 'door',
                        disableOpenGesture: true,
                    },
                });
                return;
            default:
                console.error('Unknown app root');
        }
    }
}
