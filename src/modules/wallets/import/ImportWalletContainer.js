/**
 * Import New Wallet Container
 */
import { connect } from 'react-redux';

// Actions
import * as AccountsActions from '@redux/modules/accounts/actions';

// The component we're mapping to
import ImportWalletView from './ImportWalletView';

// What data from the store shall we send to the component?
const mapStateToProps = () => ({});

// Any actions to map to the component?
const mapDispatchToProps = {
    importWallet: AccountsActions.importWallet,
};

export default connect(mapStateToProps, mapDispatchToProps)(ImportWalletView);
