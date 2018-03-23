/**
 * Setup Paper Key Screen Container
 */
import { connect } from 'react-redux';

// Actions

// The component we're mapping to
import recoverPaperKeyView from './recoverPaperKeyView';

// What data from the store shall we send to the component?
const mapStateToProps = () => ({});

// Any actions to map to the component?
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(recoverPaperKeyView);
