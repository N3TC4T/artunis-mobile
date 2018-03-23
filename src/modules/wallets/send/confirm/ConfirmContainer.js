/**
 * Confirm Screen Container
 */
import { connect } from 'react-redux';

// Actions

// The component we're mapping to
import ConfirmView from './ConfirmView';

// What data from the store shall we send to the component?
const mapStateToProps = () => ({});

// Any actions to map to the component?
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmView);
