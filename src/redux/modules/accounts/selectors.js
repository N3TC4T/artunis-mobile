import { createSelector } from 'reselect';

const accountsState = state => state.get('accounts');
const marketPriceState = state => state.getIn(['core', 'marketPrice']);

export const accountBasicsSelector = createSelector([accountsState, (state, address) => address], (accounts, address) =>
    accounts.getIn([address, 'basic']).toJS(),
);

export const accountsSelector = createSelector([accountsState], accounts =>
    accounts.map(item => item.remove('basic')).toJS(),
);

const subtotalSelector = createSelector(accountsState, accounts =>
    accounts.map(entry => entry.get('balance')).reduce((prev, current) => prev + current),
);

export const totalBalanceSelector = createSelector(subtotalSelector, marketPriceState, (subtotal, marketPrice) => {
    if (marketPrice.has('USD')) {
        const currentPrice = marketPrice.getIn(['USD', 'PRICE']);
        return subtotal * currentPrice;
    }
    return 0;
});
