import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner';

export default function DAlert(props) {
  const {
    title,
    message,
    status,
    dissmissAction,
    className,
    showSuccess = true,
    showSpinner = true,
  } = props;
  console.log(props)

  let variant = 'danger';
  if (status === 'succeeded') variant = 'success';
  if (status === 'pending') variant = 'info';

  const dispatch = useDispatch();

  const dissmiss = type => dispatch({
    type,
  });

  const onClickClose = () => {
    if (dissmissAction) {
      dissmiss(dissmissAction);
    }
  };

  if (status && (status !== 'succeeded' || showSuccess)) {
    return (
      <Alert
        variant={variant}
        className={className}
        onClose={onClickClose}
        dismissible
      >
        {title && (
          <Alert.Heading>{title}</Alert.Heading>
        )}
        {showSpinner && status === 'pending' && (
          <Spinner animation="border" variant="info" role="status" size="sm" className="mr-2" />
        )}
        {message || status}
      </Alert>
    );
  }
  return null;
}

DAlert.defaultProps = {
  title: '',
  message: '',
  status: '',
  dissmissAction: '',
  className: '',
  showSuccess: true,
  showSpinner: true,
};

DAlert.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  status: PropTypes.string,
  dissmissAction: PropTypes.string,
  className: PropTypes.string,
  showSuccess: PropTypes.bool,
  showSpinner: PropTypes.bool,
};
