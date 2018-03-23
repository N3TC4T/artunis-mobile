/**
 * Recipient Picker Screen Container
 */
import { connect } from 'react-redux';

import { contactsSelector } from '@redux/modules/contacts/selectors';

// Actions

// The component we're mapping to
import RecipientPickerView from './RecipientPickerView';

// What data from the store shall we send to the component?
const mapStateToProps = state => ({
    contacts: contactsSelector(state),
});

// Any actions to map to the component?
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(RecipientPickerView);
