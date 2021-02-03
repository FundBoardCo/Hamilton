import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import * as types from '../actions/types';
import Status from '../components/DismissibleStatus';

let prevMode = '';

export default function Login() {
  const user = useSelector(state => state.user) || {};
  const {
    email = '',
    create_status,
    login_status,
    reset_status,
  } = user;

  const openModal = useSelector(state => state.modal.openModal);
  const modalProps = useSelector(state => state.modal.modalProps);
  const { extraText, initialMode } = modalProps;

  const [mode, setMode] = useState(initialMode || 'login');

  const [validated, setValidated] = useState(false);
  const [started, setStarted] = useState(false);

  const [emailValue, setEmailValue] = useState(email);
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: types.USER_LOGIN_DISSMISSED,
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: types.USER_CREATE_DISSMISSED,
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: types.USER_RESETPASSWORD_DISSMISSED,
    });
  }, [dispatch]);

  const create = () => dispatch({
    type: types.USER_CREATE_REQUESTED,
    params: { email: emailValue, password },
  });

  const login = () => dispatch({
    type: types.USER_LOGIN_REQUESTED,
    params: { username: emailValue, password },
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
      } else if (mode === 'create') {
        create();
      } else if (mode === 'reset') {
        reset();
        setMode('reseted');
      }
    }
  };

  const onEmailChange = e => {
    setEmailValue(e.target.value);
    setStarted(true);
  };

  const onPasswordChange = e => {
    setPassword(e.target.value);
    setStarted(true);
  };

  const onLoginClick = event => {
    event.preventDefault();
    event.stopPropagation();
    setMode('login');
  };

  const onCreateClick = event => {
    event.preventDefault();
    event.stopPropagation();
    setMode('create');
  };

  const onResetClick = event => {
    event.preventDefault();
    event.stopPropagation();
    prevMode = mode;
    setMode('reset');
  };

  const onCancelResetClick = event => {
    event.preventDefault();
    event.stopPropagation();
    setMode(prevMode);
  };

  const btnProps = {
    login: {
      variant: 'secondary',
      text: 'Log in',
      type: 'submit',
    },
    create: {
      variant: 'text',
      text: 'Create account',
      type: 'button',
      onClick: onCreateClick,
    },
  };

  if (mode === 'login') {
    // this isn't currently doing anything because the modal closes on login
    // TODO: delay closing the modal until login is successful
    if (login_status === 'pending') {
      btnProps.login.text = 'Loggin in...';
      btnProps.login.disabled = true;
    }
  }

  if (mode === 'create') {
    btnProps.login = {
      variant: 'text',
      text: 'Login',
      type: 'button',
      onClick: onLoginClick,
    };
    btnProps.create = {
      variant: 'secondary',
      text: 'Save',
      type: 'submit',
    };
  }

  if (mode === 'reset') {
    btnProps.login = {
      variant: 'text',
      text: 'Cancel',
      type: 'button',
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
      text: 'Login',
      type: 'button',
      onClick: onCancelResetClick,
    };
    btnProps.create = {
      variant: 'secondary',
      text: 'Email sent',
      type: 'button',
      disabled: true,
    };
  }

  const cookiesEnabled = navigator.cookieEnabled;

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
          <h2>{mode === 'create' ? 'Create Account' : 'Log In'}</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {extraText && (
          <div>
            {extraText}
          </div>
        )}
        <Form
          noValidate
          validated={started && validated}
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
              data-track={`LoginEmail-${mode}`}
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
                data-track={`LoginPassword-${mode}`}
              />
              <Form.Text className="text-muted">
                {/* eslint-disable-next-line max-len */}
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
          {!cookiesEnabled && (
            <div className="text-warning">
              You need to enable cookies in order to log in successfully.
            </div>
          )}
          <Status
            statusPrefix="Create account:"
            status={create_status}
            dissmissAction={types.USER_CREATE_DISSMISSED}
          />
          <Status
            statusPrefix="Log in:"
            status={login_status}
            dissmissAction={types.USER_LOGIN_DISSMISSED}
          />
          <Status
            statusPrefix="Reset password:"
            status={reset_status}
            dissmissAction={types.USER_RESETPASSWORD_DISSMISSED}
          />
          <div className="footerBtnWrapper">
            <Button
              className="mr-3 btnNoMax"
              data-track={`LoginLoginBtn-${mode}`}
              {...btnProps.login}
            >
              {btnProps.login.text}
            </Button>
            <Button
              className="btnNoMax"
              data-track={`LoginCreateBtn-${mode}`}
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
