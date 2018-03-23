/**
 * Scan Screen Container
 */
import { connect } from 'react-redux';

// Actions
import * as CoreActions from '@redux/modules/core/actions';

// The component we're mapping to
import ScanView from './ScanView';

// What data from the store shall we send to the component?
const mapStateToProps = () => ({});

// Any actions to map to the component?
const mapDispatchToProps = {
    setScanResult: CoreActions.setScanResult,
};

export default connect(mapStateToProps, mapDispatchToProps)(ScanView);
