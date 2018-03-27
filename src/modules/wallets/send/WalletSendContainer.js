/**
 * Send Transaction Screen Container
 */
import { connect } from 'react-redux';

import { accountsSelector } from '@redux/modules/accounts/selectors';
import { marketSelector, configSelector } from '@redux/modules/core/selectors';

// Actions
import * as CoreActions from '@redux/modules/core/actions';

// The component we're mapping to
import WalletSendView from './WalletSendView';

// What data from the store shall we send to the component?
const mapStateToProps = state => ({
    coreConfig: configSelector(state),
    accounts: accountsSelector(state),
    market: marketSelector(state),
    scanResult: state.getIn(['core', 'scanResult']).toJS(),
});

// Any actions to map to the component?
const mapDispatchToProps = {
    clearScanResult: CoreActions.clearScanResult,
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletSendView);
