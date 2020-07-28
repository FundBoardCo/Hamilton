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
    token,
    create_state,
    login_state,
  } = user;

  const openModal = useSelector(state => state.modal.openModal);

  const [mode, setMode] = useState('login');

  const [validated, setValidated] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const [emailValue, setEmailValue] = useState(email);
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const create = () => dispatch({
    type: types.USER_CREATE_REQUESTED,
    params: { email, password },
  });

  const login = () => dispatch({
    type: types.USER_LOGIN_REQUESTED,
    params: { email, password },
  });

  const reset = params => dispatch({
    type: types.USER_RESETPASSWORD_REQUESTED,
    params,
  });

  const unSetModal = () => dispatch({
    type: types.MODAL_SET_OPEN,
    modal: null,
  });

  const onEmailChange = e => {
    const input = e.currentTarget;
    const val = e.target.value;
    setValidated(true);
    if (input.checkValidity()) {
      setIsValid(true);
      setEmailValue(val);
    } else {
      setEmailValue(val);
      setIsValid(false);
    }
  };

  const onPasswordChange = e => {
    const input = e.currentTarget;
    const val = e.target.value;
    setValidated(true);
    if (input.checkValidity()) {
      setIsValid(true);
      setPassword(val);
    } else {
      setPassword(val);
      setIsValid(false);
    }
  };

  const onLoginClick = () => {
    if (mode === 'login') {
      login();
    } else {
      setMode('login');
    }
  };

  const onCreateClick = () => {
    if (mode === 'create') {
      create();
    } else {
      setMode('create');
    }
  };

  const location = useLocation();

  const path = location.pathname.substring(1);

  let modalTitleEnd = 'this page.';

  if (path === 'board') modalTitleEnd = 'your FundBoard.';

  if (path === 'profile') modalTitleEnd = 'your profile.';

  const history = useHistory();

  const closeModal = () => {
    if (openModal) {
      unSetModal();
    } else {
      history.goBack();
    }
  };

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
        <Form noValidate validated={validated}>
          <Form.Group controlId="EmailInput">
            <Form.Label className="sr-only">Email Address</Form.Label>
            <Form.Control
              required
              type="email"
              placeholder="email address"
              value={emailValue}
              onChange={e => onEmailChange(e)}
              isInvalid={validated && !isValid}
              data-track="LoginEmail-{mode}"
            />
            <Form.Control.Feedback type="invalid">
              Please enter a valid email address.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="PasswordInput">
            <Form.Label className="sr-only">Password</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="password"
              value={password}
              pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
              onChange={e => onPasswordChange(e)}
              isInvalid={validated && !isValid}
              data-track="LoginPassword-{mode}"
            />
            <Form.Text className="text-muted">
              Enter a password with 8 or more characters, and at least one upper and lower case letter, number, and special character.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              Please enter a valid password.
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex flex-grow-1 justify-content-end">
          <Button
            variant={mode === 'login' ? 'secondary' : 'text'}
            className="mr-3"
            onClick={onLoginClick}
          >
            {mode === 'login' ? 'Log in' : 'Cancel'}
          </Button>
          <Button
            variant={mode === 'create' ? 'secondary' : 'text'}
            onClick={onCreateClick}
          >
            {mode === 'create' ? 'Save' : 'Create Account'}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
