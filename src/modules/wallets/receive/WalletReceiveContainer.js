/**
 * Receive Screen Container
 */
import { connect } from 'react-redux';

import { accountsSelector } from '@redux/modules/accounts/selectors';

// Actions

// The component we're mapping to
import WalletReceiveView from './WalletReceiveView';

// What data from the store shall we send to the component?
const mapStateToProps = state => ({
    accounts: accountsSelector(state),
});

// Any actions to map to the component?
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(WalletReceiveView);
