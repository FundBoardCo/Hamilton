import React from 'react';
import PropTypes from 'prop-types';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { processErr, stateIsError, capitalizeFirstLetter } from '../utils';

export default function CallStatus(props) {
  const { status = '', type = '', hideSuccess = false, className = '' } = props;
  const typeTitle = type ? `${capitalizeFirstLetter(type)} ` : '';
  let variant;
  let showSpinner;
  let msg;
  let hide;

  if (status === 'pending' || status === 'fetching') {
    variant = 'info';
    showSpinner = true;
    msg = props.pendingMsg || `${capitalizeFirstLetter(status)}...`;
  } else if (status === 'succeeded') {
    variant = 'success';
    msg = props.successMsg || 'Succeeded';
    if (hideSuccess) hide = true;
  } else if (stateIsError(status)) {
    variant = 'danger';
    msg = processErr(status) || 'Error';
  }

  if (status && !hide) {
    return (
      <Alert variant={variant} className={className}>
        {showSpinner && <Spinner animation="border" role="status" size="sm" className="mr-2" />}
        {`${typeTitle}${msg}`}
      </Alert>
    );
  }
  return null;
}

CallStatus.defaultProps = {
  status: '',
  type: '',
  hideSuccess: false,
  pendingMsg: '',
  successMsg: '',
  className: '',
};

CallStatus.propTypes = {
  status: PropTypes.string,
  type: PropTypes.string,
  hideSuccess: PropTypes.bool,
  pendingMsg: PropTypes.string,
  successMsg: PropTypes.string,
  className: PropTypes.string,
};
