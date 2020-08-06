import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import * as types from '../../actions/types';

export default function Profile() {
  const loggedIn = useSelector(state => state.user.token);
  const user = useSelector(state => state.user) || {};
  const {
    email,
  } = user;
  const updateState = useSelector(state => state.update_status);
  const deleteState = useSelector(state => state.delete_status);

  const [validated, setValidated] = useState(false);
  const [emailValue, setEmailValue] = useState(email);
  const [password, setPassword] = useState('');
  const [deletePressed, setDeletePressed] = useState(false);

  const dispatch = useDispatch();

  const updateAccount = params => dispatch({
    type: types.USER_UPDATE_REQUESTED,
    params,
  });

  const logout = () => dispatch({
    type: types.USER_LOGOUT,
  });

  const deleteAccount = () => dispatch({
    type: types.USER_DELETE_REQUESTED,
    email,
  });

  const onEmailChange = e => {
    setEmailValue(e.target.value);
  };

  const onPasswordChange = e => {
    setPassword(e.target.value);
  };

  const handleSubmit = event => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
    if (form.checkValidity() !== false) {
      const params = {};
      if (emailValue !== email) params.email = emailValue;
      if (password) params.password = password;
      updateAccount(params);
    }
  };

  const onLogoutClick = () => {
    logout();
  };

  const onDeleteClick = () => {
    if (deletePressed) {
      deleteAccount();
    } else {
      setDeletePressed(true);
    }
  };

  const btnProps = {
    update: {
      variant: 'secondary',
      text: 'Update my information',
      disabled: false,
    },
    logout: {
      variant: 'info',
      text: 'Log out',
      disabled: false,
    },
    delete: {
      variant: 'warning',
      text: 'Delete my account',
      disabled: false,
    },
  };

  if (deletePressed) {
    btnProps.delete = {
      variant: 'danger',
      text: 'Yes, I am sure I want to delete my account',
    };
  }

  if (updateState === 'pending') {
    btnProps.update = {
      text: 'updating...',
      disabled: true,
    };
  }

  if (deleteState === 'pending') {
    btnProps.delete = {
      text: 'deleting...',
      disabled: true,
    };
  }

  if (deleteState === 'succeeded') {
    btnProps.delete = {
      variant: 'success',
      text: 'Account deleted',
      disabled: true,
    };
  }

  return (
    <Row id="PageProfile" className="pageContainer">
      {loggedIn && (
      <Col xs={12} md={8} className="mr-auto ml-auto">
        <h1 className="text-center">My Profile</h1>
        <p className="text-center">You can edit the very minimal data we store about you here.</p>
        <Form
          className="mb-4"
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
        >
          <Form.Group controlId="EmailInput">
            <Form.Label className="sr-only">Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="email address"
              value={emailValue}
              onChange={e => onEmailChange(e)}
              data-track="ProfileNewEmail"
            />
            <Form.Control.Feedback type="invalid">
              Please enter a valid email address.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="PasswordInput">
            <Form.Label className="sr-only">New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="new password"
              value={password}
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              onChange={e => onPasswordChange(e)}
              data-track="ProfileNewPassword"
            />
            <Form.Text className="text-muted">
              Enter a password with 8 or more characters, and at least one upper and lower case letter and number.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              Please enter a valid password.
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex flex-grow-1 justify-content-end">
            {updateState === 'succeeded' && (
              <div className="mr-auto text-success">
                Information updated.
              </div>
            )}
            <Button
              className="btnNoMax"
              type="submit"
              {...btnProps.update}
            >
              {btnProps.update.text}
            </Button>
          </div>
        </Form>
        <hr className="mb-4" />
        <div className="mb-4">
          <h2 className="text-center">Log Out</h2>
          <p>Click the button below to log out of your account.</p>
          <div className="d-flex flex-grow-1 justify-content-end">
            <Button
              className="btnNoMax"
              onClick={onLogoutClick}
              {...btnProps.logout}
            >
              {btnProps.logout.text}
            </Button>
          </div>
        </div>
        <hr className="mb-4" />
        <h2 className="text-center">Delete Account</h2>
        <p>Click the button below to permanently delete your account.</p>
        <p><em>There is no way to recover a deleted account, be certain before proceeding.</em></p>
        <div className="d-flex flex-grow-1 justify-content-end">
          <Button
            className="btnNoMax"
            onClick={onDeleteClick}
            {...btnProps.delete}
          >
            {btnProps.delete.text}
          </Button>
        </div>
      </Col>
      )}
      {!loggedIn && (
        <Col xs={12} md={8} className="mr-auto ml-auto">
          <h1>To see your profile, you need to log in first.</h1>
        </Col>
      )}
    </Row>
  );
}
