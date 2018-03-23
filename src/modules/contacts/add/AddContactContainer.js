/**
 * Add New Contact Screen Container
 */
import { connect } from 'react-redux';

// Actions
import * as ContactsActions from '@redux/modules/contacts/actions';

// The component we're mapping to
import AddContactView from './AddContactView';

// What data from the store shall we send to the component?
const mapStateToProps = () => ({});

// Any actions to map to the component?
const mapDispatchToProps = {
    saveContact: ContactsActions.saveContact,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddContactView);
