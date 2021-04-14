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

function LinkInput(props) {
  const {
    text,
    url,
    linkIndex,
    onLinkTextChange,
    onLinkURLChange,
    onLinkRemove,
  } = props;
  return (
    <Form.Row>
      <Col>
        <Form.Group controlId={`LinkTextInput-${linkIndex}`}>
          <Form.Label>Link Label</Form.Label>
          <Form.Control
            type="text"
            placeholder="A label for the link"
            value={text}
            onChange={e => onLinkTextChange(e.target.value, linkIndex)}
            data-track="ProfileLinkInput"
            isInvalid={!text && url}
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid url.
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col>
        <Form.Group controlId={`LinkURLInput-${linkIndex}`}>
          <Form.Label>Link URL</Form.Label>
          <Form.Control
            type="url"
            placeholder="The URL for the link"
            value={url}
            onChange={e => onLinkURLChange(e.target.value, linkIndex)}
            data-track="ProfileLinkInput"
            isInvalid={text && !url}
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid url.
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col className="flex-grow-0">
        <button
          className="btn iconBtn text-secondary endOfRowWithLabelBtn"
          type="button"
          onClick={() => onLinkRemove(linkIndex)}
        >
          <FontAwesomeIcon icon="times" />
        </button>
      </Col>
    </Form.Row>
  );
}

export default function Profile() {
  const loggedIn = useSelector(state => state.user.sessionToken);
  const place = useSelector(state => state.user.place);
  const overridePlace = useSelector(state => state.user.overridePlace);
  const allowIn = loggedIn && typeof place === 'number' && (place <= MINPLACE || overridePlace);
  const profile = useSelector(state => state.user.profile) || {};
  const board_public = useSelector(state => state.user.board_public);
  const email = useSelector(state => state.user.email) || '';
  const searchRemote = useSelector(state => state.search.remote) || false;
  const updateStatus = useSelector(state => state.user.update_status);
  const updateProfileStatus = useSelector(state => state.user.updateProfile_status);
  const getProfileStatus = useSelector(state => state.user.get_profile_status);
  const deleteStatus = useSelector(state => state.user.delete_status);

  const initialInputState = {
    password: '',
    name: profile.name || '',
    title: profile.primary_job_title || '',
    orgName: profile.primary_organization_name || '',
    orgURL: profile.primary_organization_homepage || '',
    orgLogoURL: profile.primary_organization_logo || '',
    desc: profile.description || '',
    linkedin: profile.linkedin || '',
    twitter: profile.twitter || '',
    permalink: profile.permalink || '',
    links: profile.links || [],
    remote: profile.remote !== undefined ? !!profile.remote : !!searchRemote,
    location_city: profile.location_city || '',
    location_state: profile.location_state || '',
    team_size: profile.team_size || 1,
  };

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

  const publicInputs1 = {
    name: {
      label: 'Your Full Name',
      placeholder: 'name',
      value: inputState.name,
    },
    title: {
      label: 'Your Title At Your Startup',
      placeholder: 'title',
      value: inputState.title,
    },
    orgName: {
      label: 'The Name of Your Startup',
      placeholder: 'startup name',
      value: inputState.orgName,
    },
    orgURL: {
      label: 'Your Startup’s Website',
      type: 'url',
      placeholder: 'http://something.com',
      feedback: true,
      value: inputState.orgURL,
    },
    orgLogoURL: {
      label: 'A Link to Your Startup’s Logo',
      type: 'url',
      placeholder: 'http://something.com/something.jpg',
      formText: 'You should link to an image that is at least 100 x 100 px, but not larger than '
        + '400 x 400.',
      feedback: true,
      value: inputState.orgLogoURL,
    },
  };

  const publicInputs2 = {
    linkedin: {
      label: 'Your LinkedIn Page',
      type: 'url',
      placeholder: 'LinkedIn url',
      feedback: true,
      value: inputState.linkedin,
    },
    twitter: {
      label: 'Your Twitter Page',
      type: 'url',
      placeholder: 'Twitter url',
      feedback: true,
      value: inputState.twitter,
    },
    permalink: {
      label: 'Your CrunchBase Page',
      type: 'url',
      placeholder: 'CrunchBase url',
      feedback: true,
      value: inputState.permalink,
    },
  };

  const publicInputs3 = {
    team_size: {
      label: 'How Many People Are On Your Team?',
      type: 'number',
      min: 1,
      placeholder: 'number equal to or higher than 1',
      feedback: true,
      value: inputState.team_size,
    },
    location_city: {
      label: 'Your City (HQ, or personal if fully remote)',
      placeholder: 'City',
      value: inputState.location_city,
    },
    location_state: {
      label: 'Your State',
      placeholder: 'XX',
      formText: 'Use a 2 letter state abbreviation.',
      value: inputState.location_state,
      pattern: '[A-Z]{2}',
    },
    remote: {
      label: 'We’re fully remote',
      type: 'checkbox',
      value: !!inputState.remote,
    },
  };

  const [validated, setValidated] = useState(false);
  const [publicValidated, setPublicValidated] = useState(false);
  const [deletePressed, setDeletePressed] = useState(false);
  const [currentUpdate, setCurrentUpdate] = useState();
  const [showPublicInputs, setShowPublicInputs] = useState(false);

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

  const updateFounderData = params => dispatch({
    type: types.USER_POST_PROFILE_REQUESTED,
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

  const setLinkText = (text, index) => {
    const newLinks = [...inputState.links];
    newLinks[index].text = text;
    setInputState(prevState => ({ ...prevState, links: newLinks }));
  };

  const setLinkURL = (url, index) => {
    const newLinks = [...inputState.links];
    newLinks[index].url = url;
    setInputState(prevState => ({ ...prevState, links: newLinks }));
  };

  const removeLink = i => {
    const newLinks = [...inputState.links];
    newLinks.splice(i, 1);
    setInputState(prevState => ({ ...prevState, links: newLinks }));
  };

  const addLink = () => {
    const newLinks = [
      ...inputState.links,
      {
        text: '',
        url: '',
        key: Math.floor(Math.random() * Math.floor(1000000)),
      },
    ];
    setInputState(prevState => ({ ...prevState, links: newLinks }));
  };

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

  const handlePublicSubmit = event => {
    setCurrentUpdate('public');
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    setPublicValidated(true);
    if (form.checkValidity() !== false) {
      const params = {
        primary_job_title: inputState.title,
        primary_organization_name: inputState.orgName,
        primary_organization_homepage: inputState.orgURL,
        primary_organization_logo: inputState.orgLogoURL,
        description: inputState.desc,
        remote: !!inputState.remote,
        ...inputState,
      };
      updateFounderData(params);
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

  const btnProps = {
    update: {
      variant: 'secondary',
      text: 'Update my account',
      disabled: false,
    },
    updateFounderData: {
      variant: 'secondary',
      text: 'Update my public profile',
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
            <Form
              className="mb-5 mb-md-4"
              noValidate
              validated={publicValidated}
              onSubmit={handlePublicSubmit}
            >
              {Object.keys(publicInputs1).map(k => (
                <FormInput
                  onChange={onInputChange}
                  key={k}
                  iKey={k}
                  {...publicInputs1[k]}
                />
              ))}
              {showPublicInputs && (
                <div>
                  <Form.Group controlId="DescriptionInput">
                    <Form.Label>A Short Bio or Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      placeholder="More information about you that would be relevant to someone making an intro."
                      name="desc"
                      value={inputState.desc}
                      onChange={e => onInputChange(e)}
                      data-track="ProfileDescription"
                    />
                  </Form.Group>
                  {Object.keys(publicInputs2).map(k => (
                    <FormInput
                      onChange={onInputChange}
                      key={k}
                      iKey={k}
                      {...publicInputs2[k]}
                    />
                  ))}
                  <h5>Additional Links</h5>
                  {inputState.links.map((l, i) => (
                    <LinkInput
                      text={l.text}
                      url={l.url}
                      key={l.key}
                      linkIndex={i}
                      onLinkTextChange={setLinkText}
                      onLinkURLChange={setLinkURL}
                      onLinkRemove={removeLink}
                    />
                  ))}
                  <Button
                    variant="link"
                    className="text-secondary mb-4"
                    type="button"
                    onClick={addLink}
                    data-track="ProfileAddLink"
                  >
                    Add another link
                  </Button>
                  {Object.keys(publicInputs3).map(k => (
                    <FormInput
                      onChange={onInputChange}
                      key={k}
                      iKey={k}
                      {...publicInputs3[k]}
                    />
                  ))}
                </div>
              )}
              {currentUpdate === 'public' && (
                <DismissibleStatus
                  status={updateStatus}
                  statusPrefix="Updating Profile"
                  dissmissAction={types.USER_UPDATE_DISSMISSED}
                />
              )}
              <div className="d-flex flex-grow-1 flex-column flex-md-row align-items-center">
                <Button
                  variant="link"
                  className="txs-2 tx-md-1 mb-4 mb-md-0"
                  onClick={() => setShowPublicInputs(!showPublicInputs)}
                  data-track={`ProfileShowOptions-${showPublicInputs ? 'Hide' : 'Show'}`}
                >
                  <FontAwesomeIcon
                    icon={showPublicInputs ? 'eye-slash' : 'eye'}
                    className="mr-2"
                  />
                  {`${showPublicInputs ? 'Hide' : 'Show'} Additional Options`}
                </Button>
                <Button
                  className="btnMobile100 ml-auto"
                  type="submit"
                  data-track="ProfileUpdateFounderData"
                  {...btnProps.updateFounderData}
                >
                  {btnProps.updateFounderData.text}
                </Button>
              </div>
              <DismissibleStatus
                status={updateProfileStatus}
                statusPrefix="Updating FundBoard"
                dissmissAction={types.USER_POST_PROFILE_DISMISSED}
              />
            </Form>
          </section>
        )}
        <section className="mb-5 mb-md-4">
          <h2 className="sectionHead">Hide Your FundBoard</h2>
          <p>
            If you want to hide your investors only you can seet them, set them to hidden here.
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

LinkInput.defaultProps = {
  text: '',
  url: '',
  linkIndex: 0,
  onLinkTextChange: {},
  onLinkURLChange: {},
  onLinkRemove: {},
};

LinkInput.propTypes = {
  text: PropTypes.string,
  url: PropTypes.string,
  linkIndex: PropTypes.number,
  onLinkTextChange: PropTypes.func,
  onLinkURLChange: PropTypes.func,
  onLinkRemove: PropTypes.func,
};

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
