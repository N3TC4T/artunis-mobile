/**
 * Sign Transaction Screen Container
 */
import { connect } from 'react-redux';

import { accountBasicsSelector } from '@redux/modules/accounts/selectors';

// Actions

// The component we're mapping to
import SignTransactionView from './SignTransactionView';

// What data from the store shall we send to the component?
const mapStateToProps = (state, ownProps) => ({
    accountBasics: accountBasicsSelector(state, ownProps.account.address),
});

// Any actions to map to the component?
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SignTransactionView);
