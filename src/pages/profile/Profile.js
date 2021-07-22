import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as types from '../../actions/types';
import DismissibleStatus from '../../components/DismissibleStatus';
import FormInput from '../../components/FormInput';
import { MINPLACE } from '../../constants';
import ProfileDetails from '../../components/ProfileDetails';
import btnProps from '../../utils/profileUtils';

const initialInputState = {
  password: '',
  name: '',
  title: '',
  orgName: '',
  orgURL: '',
  orgLogoURL: '',
  desc: '',
  linkedin: '',
  twitter: '',
  permalink: '',
  links: [],
  remote: false,
  location_city: '',
  location_state: '',
  team_size: 1,
};

export default function Profile() {
  const loggedIn = useSelector(state => state.user.sessionToken);
  const place = useSelector(state => state.user.place);
  const overridePlace = useSelector(state => state.user.overridePlace);
  const allowIn = loggedIn && typeof place === 'number' && (place <= MINPLACE || overridePlace);
  const profile = useSelector(state => state.user.profile) || {};
  const board_public = useSelector(state => state.user.board_public);
  const email = useSelector(state => state.user.email) || '';
  const updateStatus = useSelector(state => state.user.update_status);
  const getProfileStatus = useSelector(state => state.user.get_profile_status);
  const deleteStatus = useSelector(state => state.user.delete_status);
  const searchRemote = useSelector(state => state.search.remote) || false;

  const [inputState, setInputState] = useState(initialInputState);

  const accountInputs = {
    password: {
      label: 'New Password',
      type: 'password',
      placeholder: 'password',
      feedback: true,
      formText: 'Enter a password with 8 or more characters, and at least one upper and lower '
        + 'case letter and number.',
      value: inputState.password,
    },
  };

  const [validated, setValidated] = useState(false);
  const [deletePressed, setDeletePressed] = useState(false);
  const [currentUpdate, setCurrentUpdate] = useState();

  const clearState = () => {
    setInputState({ ...initialInputState });
  };

  const onInputChange = e => {
    // eslint-disable-next-line no-shadow
    const { name, type, checked } = e.target;
    let { value } = e.target;
    if (type === 'checkbox') value = !!checked;
    if (type === 'number') value = Number(value);
    setInputState(prevState => ({ ...prevState, [name]: value }));
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: types.USER_GET_PROFILE_REQUESTED,
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: types.USER_UPDATE_DISSMISSED,
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: types.USER_DELETE_DISSMISSED,
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: types.USER_POST_PROFILE_DISMISSED,
    });
  }, [dispatch]);

  const updateAccount = params => dispatch({
    type: types.USER_UPDATE_REQUESTED,
    params,
  });

  const logout = () => {
    dispatch({
      type: types.USER_LOGOUT,
    });
    clearState();
  };

  const deleteAccount = () => dispatch({
    type: types.USER_DELETE_REQUESTED,
    email,
  });

  const handleSubmit = event => {
    setCurrentUpdate('account');
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
    if (form.checkValidity() !== false) {
      const params = {};
      if (inputState.password) params.password = inputState.password;
      updateAccount(params);
    }
  };

  const onTogglePublicBoard = () => {
    setCurrentUpdate('board');
    const params = {
      board_public: !board_public,
    };
    updateAccount(params);
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

  if (deletePressed) {
    btnProps.delete = {
      variant: 'danger',
      text: 'Yes, I am sure I want to delete my account',
    };
  }

  if (updateStatus === 'pending') {
    btnProps.update = {
      ...btnProps.update,
      text: 'updating...',
      disabled: true,
    };
  }

  if (updateStatus === 'pending') {
    btnProps.updateFounderData = {
      ...btnProps.updateFounderData,
      text: 'updating...',
      disabled: true,
    };
  }

  if (deleteStatus === 'pending') {
    btnProps.delete = {
      text: 'deleting...',
      disabled: true,
    };
  }

  if (deleteStatus === 'succeeded') {
    btnProps.delete = {
      variant: 'success',
      text: 'Account deleted',
      disabled: true,
    };
  }

  return (
    <Row id="PageProfile" className="pageContainer">
      <Col xs={12} md={8} className="mr-auto ml-auto">
        <h1 className="text-center mb-4">My Profile</h1>
        <Form
          className="mb-5 mb-md-4"
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
        >
          <h2 className="sectionHead">Account Information</h2>
          <div className="mb-2">
            <b>Email Address: </b>
            <span>{email}</span>
          </div>
          {Object.keys(accountInputs).map(k => (
            <FormInput
              onChange={onInputChange}
              key={k}
              iKey={k}
              {...accountInputs[k]}
            />
          ))}
          {currentUpdate === 'account' && (
            <DismissibleStatus
              status={updateStatus}
              statusPrefix="Updating Account"
              dissmissAction={types.USER_UPDATE_DISSMISSED}
            />
          )}
          <div className="d-flex flex-grow-1 justify-content-end">
            <Button
              className="btnMobile100"
              type="submit"
              data-track="ProfileUpdateAccount"
              {...btnProps.update}
            >
              {btnProps.update.text}
            </Button>
          </div>
        </Form>
        {allowIn && (
          <section className="mb-5 mb-md-4">
            <h2 className="sectionHead">Profile (Optional)</h2>
            <p>Your profile will be shown on your public FundBoard.</p>
            <div>
              <DismissibleStatus
                status={getProfileStatus}
                statusPrefix="Fetching Public Data"
                showSuccess={false}
                dissmissAction={types.USER_GET_PROFILE_DISMISSED}
              />
              {currentUpdate === 'board' && (
                <DismissibleStatus
                  status={updateStatus}
                  statusPrefix="Updating FundBoard"
                  dissmissAction={types.USER_UPDATE_DISSMISSED}
                />
              )}
            </div>
            <ProfileDetails profile={{
              ...profile,
              remote: profile.remote !== undefined ? !!profile.remote : !!searchRemote,
            }}
            />
          </section>
        )}
        <section className="mb-5 mb-md-4">
          <h2 className="sectionHead">Hide Your FundBoard</h2>
          <p>
            If you want to hide your investors only you can see them, set them to hidden here.
            Your FundBoard link will still be viewable, but none of your investors will be shown
            except to you.
          </p>
          <div className="d-flex justify-content-center justify-content-md-end">
            <Button
              variant="link"
              className="txs-2 txs-md-1"
              disabled={updateStatus === 'pending'}
              onClick={onTogglePublicBoard}
              data-track={`ProfileTogglePublicBoard-${board_public ? 'Private' : 'Public'}`}
            >
              <span>
                <FontAwesomeIcon
                  icon={board_public ? 'eye-slash' : 'eye'}
                  className="mr-2"
                />
                {`Make Your FundBoard ${board_public ? 'Private' : 'Public'}.`}
              </span>
            </Button>
          </div>
        </section>
        <section className="mb-5 mb-md-4">
          <h2 className="sectionHead">Log Out</h2>
          <p>Click the button below to log out of your account.</p>
          <div className="d-flex flex-grow-1 justify-content-end">
            <Button
              className="btnMobile100"
              onClick={onLogoutClick}
              data-track="ProfileLogout"
              {...btnProps.logout}
            >
              {btnProps.logout.text}
            </Button>
          </div>
        </section>
        <section className="mb-5 mb-md-4">
          <h2 className="sectionHead">Delete Account</h2>
          <p>Click the button below to permanently delete your account.</p>
          <p>
            <em>
              There is no way to recover a deleted account, be certain before proceeding.
            </em>
          </p>
          <DismissibleStatus
            status={deleteStatus}
            statusPrefix="Deleting Account"
            dissmissAction={types.USER_DELETE_DISSMISSED}
          />
          <div className="d-flex flex-grow-1 justify-content-end">
            <Button
              className="btnMobile100"
              onClick={onDeleteClick}
              data-track="ProfileDeleteAccount"
              {...btnProps.delete}
            >
              {btnProps.delete.text}
            </Button>
          </div>
        </section>
      </Col>
    </Row>
  );
}

FormInput.defaultProps = {
  iKey: '',
  label: '',
  type: '',
  placeholder: '',
  feedback: false,
  formText: '',
  value: '',
  onChange: '',
  min: 0,
};

FormInput.propTypes = {
  iKey: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  feedback: PropTypes.bool,
  formText: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  onChange: PropTypes.func,
  min: PropTypes.number,
};
