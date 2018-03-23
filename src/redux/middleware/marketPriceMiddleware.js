import SocketIOClient from 'socket.io-client';

import { ActionTypes, AppConfig } from '@constants/';

import CCC from '@libs/ccc-streamer-utilities';

// Actions
import * as coreActions from '@redux/modules/core/actions';

const marketPriceMiddleware = (() => {
    let socket = null;
    let shouldUpdate = true;
    const currentPrice = {};

    const dataUnpack = data => {
        const to = data.TOSYMBOL;
        const tsym = CCC.STATIC.CURRENCY.getSymbol(to);
        const pair = to;

        if (!Object.prototype.hasOwnProperty.call(currentPrice, pair)) {
            currentPrice[pair] = {};
        }

        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                currentPrice[pair][key] = data[key];
            }
        }
        currentPrice[pair].CHANGE24HOUR = CCC.convertValueToDisplay(
            tsym,
            currentPrice[pair].PRICE - currentPrice[pair].OPEN24HOUR,
        );
        currentPrice[pair].CHANGE24HOURPCT = `${(
            (currentPrice[pair].PRICE - currentPrice[pair].OPEN24HOUR) /
            currentPrice[pair].OPEN24HOUR *
            100
        ).toFixed(2)}%`;

        return currentPrice;
    };

    const onConnect = () => () => {
        // subscribe for prices socket
        const subscription = ['5~CCCAGG~XRP~USD'];
        socket.emit('SubAdd', { subs: subscription });

        // give permission to update store in every 8 second
        setInterval(() => {
            shouldUpdate = true;
        }, 8000);
    };

    const onMessage = store => message => {
        const messageType = message.substring(0, message.indexOf('~'));
        let res = {};
        if (messageType === CCC.STATIC.TYPE.CURRENTAGG) {
            res = CCC.CURRENT.unpack(message);
            const price = dataUnpack(res);
            if (shouldUpdate) {
                shouldUpdate = false;
                store.dispatch(coreActions.setMarketPrice(price));
            }
        }
    };

    return store => next => action => {
        switch (action.type) {
            case ActionTypes.CONNECT_MARKET_SOCKET:
                // Start a new connection to the server
                if (socket !== null) {
                    socket.close();
                }

                socket = SocketIOClient.connect(AppConfig.urls.price_ws);

                socket.on('connect', onConnect());
                socket.on('m', onMessage(store));

                break;

            // The user wants us to disconnect
            case 'SOCKET_DISCONNECT':
                if (socket !== null) {
                    socket.close();
                }
                socket = null;

                break;

            // This action is irrelevant to us, pass it on to the next middleware
            default:
                return next(action);
        }

        return next(action);
    };
})();

export default marketPriceMiddleware;
