/**
 * Setup Complete Screen Container
 */
import { connect } from 'react-redux';

// Actions
import * as CoreActions from '@redux/modules/core/actions';
import * as AccountsActions from '@redux/modules/accounts/actions';

// The component we're mapping to
import setupCompleteView from './setupCompleteView';

const mapStateToProps = () => ({});

const mapDispatchToProps = {
    coreBoot: CoreActions.boot,
    coreInitialize: CoreActions.initialize,
    createWallet: AccountsActions.createWallet,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    coreBoot: dispatchProps.coreBoot,
    coreInitialize: () => dispatchProps.coreInitialize(ownProps.paperKeys, ownProps.password),
    createWallet: () => dispatchProps.createWallet(ownProps.password),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(setupCompleteView);
