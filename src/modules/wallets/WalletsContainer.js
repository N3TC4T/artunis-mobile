/**
 * Intro Screen Container
 */
import { connect } from 'react-redux';

// Selectors
import { accountsSelector, totalBalanceSelector } from '@redux/modules/accounts/selectors';
import { marketSelector } from '@redux/modules/core/selectors';

// Actions

// The component we're mapping to
import WalletsView from './WalletsView';

// What data from the store shall we send to the component?
const mapStateToProps = state => ({
    accounts: accountsSelector(state),
    totalBalance: totalBalanceSelector(state),
    market: marketSelector(state),
});

// Any actions to map to the component?
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(WalletsView);
