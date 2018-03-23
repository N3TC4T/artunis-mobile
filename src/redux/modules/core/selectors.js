import { createSelector } from 'reselect';

const marketPriceSelector = state => state.getIn(['core', 'marketPrice']);
const coreSelector = state => state.get('core');

export const marketSelector = createSelector([marketPriceSelector], marketPrice => {
    if (marketPrice.has('USD')) {
        const current = marketPrice.get('USD').toJS();
        let priceDirection = 'up';

        if (current.PRICE > current.OPEN24HOUR) {
            priceDirection = 'up';
        } else if (current.PRICE < current.OPEN24HOUR) {
            priceDirection = 'down';
        }

        return {
            currentPrice: current.PRICE,
            priceDirection,
            percentChange: current.CHANGE24HOURPCT,
        };
    }
    return {
        currentPrice: 0,
        priceDirection: 'up',
        percentChange: '0%',
    };
});

export const configSelector = createSelector([coreSelector], core => ({
    maxFee: core.get('maxFee'),
    maxLedgerVersionOffset: core.get('maxLedgerVersionOffset'),
    ledgerVersion: core.get('ledgerVersion'),
}));
