import React, { useEffect, useState } from 'react';
import {useHistory, useLocation} from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from 'react-bootstrap/Button';
import * as types from '../actions/types';
import Modal from "react-bootstrap/Modal";

export default function Login() {
  const user = useSelector(state => state.user) || {};
  console.log(user)
  const {
    email,
    create_state,
    login_state,
    reset_state,
  } = user;

  const openModal = useSelector(state => state.modal.openModal);

  const [mode, setMode] = useState('login');
  let prevMode = '';

  const [validated, setValidated] = useState(false);

  const [emailValue, setEmailValue] = useState(email);
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const create = () => dispatch({
    type: types.USER_CREATE_REQUESTED,
    params: { email: emailValue, password },
  });

  const login = () => dispatch({
    type: types.USER_LOGIN_REQUESTED,
    params: { email: emailValue, password },
  });

  const reset = () => dispatch({
    type: types.USER_RESETPASSWORD_REQUESTED,
    params: { email: emailValue },
  });

  const unSetModal = () => dispatch({
    type: types.MODAL_SET_OPEN,
    modal: null,
  });

  const history = useHistory();

  const closeModal = () => {
    if (openModal) {
      unSetModal();
    } else {
      history.goBack();
    }
  };

  const handleSubmit = event => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
    if (form.checkValidity() !== false) {
      if (mode === 'login') {
        login();
        closeModal();
      } else if (mode === 'create') {
        create();
        closeModal();
      } else if (mode === 'reset') {
        reset();
        setMode('reseted');
      }
    }
  };

  const onEmailChange = e => {
    setEmailValue(e.target.value);
  };

  const onPasswordChange = e => {
    setPassword(e.target.value);
  };

  const onLoginClick = () => {
    setMode('login');
  };

  const onCreateClick = () => {
    setMode('create');
  };

  const onResetClick = () => {
    console.log('reset click')
    prevMode = mode;
    setMode('reset');
  };

  const onCancelResetClick = () => {
    setMode(prevMode);
  };

  const location = useLocation();

  const path = location.pathname.substring(1);

  let modalTitleEnd = 'this page.';

  if (path === 'board') modalTitleEnd = 'your FundBoard.';

  if (path === 'profile') modalTitleEnd = 'your profile.';

  const btnProps = {
    login: {
      variant: 'secondary',
      text: 'Log in',
      type: 'submit',
    },
    create: {
      variant: 'text',
      text: 'Create account',
      onClick: onCreateClick,
    },
  };

  if (mode === 'create') {
    btnProps.login = {
      variant: 'text',
      text: 'Cancel',
      onClick: onLoginClick,
    };
    btnProps.create = {
      variant: 'secondary',
      text: 'Save',
      type: 'submit',
    };
  }

  if (mode === 'reset') {
    console.log('mode is reset')
    btnProps.login = {
      variant: 'text',
      text: 'Cancel',
      onClick: onCancelResetClick,
    };
    btnProps.create = {
      variant: 'secondary',
      text: 'Send reset email',
      type: 'submit',
    };
  }

  if (mode === 'reseted') {
    btnProps.login = {
      variant: 'text',
      text: 'Cancel',
      disabled: true,
    };
    btnProps.create = {
      variant: 'secondary',
      text: 'Email sent',
      disabled: true,
    };
  }

  console.log(mode)
  console.log(btnProps)

  return (
    <Modal
      size="lg"
      aria-labelledby="Modal-Title"
      centered
      show
      scrollable
      className="modal-login"
      onHide={closeModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h2>{`Log in to see ${modalTitleEnd}`}</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
        >
          <Form.Group controlId="EmailInput">
            <Form.Label className="sr-only">Email Address</Form.Label>
            <Form.Control
              required
              type="email"
              placeholder="email address"
              value={emailValue}
              onChange={e => onEmailChange(e)}
              data-track="LoginEmail-{mode}"
            />
            <Form.Control.Feedback type="invalid">
              Please enter a valid email address.
            </Form.Control.Feedback>
          </Form.Group>
          {['login', 'create'].includes(mode) && (
            <Form.Group controlId="PasswordInput">
              <Form.Label className="sr-only">Password</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="password"
                value={password}
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                onChange={e => onPasswordChange(e)}
                data-track="LoginPassword-{mode}"
              />
              <Form.Text className="text-muted">
                Enter a password with 8 or more characters, and at least one upper and lower case letter and number.
              </Form.Text>
              <Form.Control.Feedback type="invalid">
                Please enter a valid password.
              </Form.Control.Feedback>
            </Form.Group>
          )}
          {['login', 'create'].includes(mode) && (
            <div className="d-flex justify-content-end mb-4">
              <Button
                variant="link"
                onClick={onResetClick}
              >
                <span className="txs-2">Reset my password</span>
              </Button>
            </div>
          )}
          <div className="footerBtnWrapper">
            <Button
              className="mr-3 btnNoMax"
              {...btnProps.login}
            >
              {btnProps.login.text}
            </Button>
            <Button
              className="btnNoMax"
              {...btnProps.create}
            >
              {btnProps.create.text}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
