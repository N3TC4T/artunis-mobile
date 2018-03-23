/**
 * Setup password Screen Container
 */
import { connect } from 'react-redux';

// Actions
import * as CoreActions from '@redux/modules/core/actions';
import * as AccountsActions from '@redux/modules/accounts/actions';

// The component we're mapping to
import setPasswordView from './setPasswordView';

const mapStateToProps = () => ({});

const mapDispatchToProps = {
    coreBoot: CoreActions.boot,
    coreInitialize: CoreActions.initialize,
    createWallet: AccountsActions.createWallet,
};

export default connect(mapStateToProps, mapDispatchToProps)(setPasswordView);
