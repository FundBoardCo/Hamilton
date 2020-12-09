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

function convertLinksFromAirTable(str) {
  let links = (str && str.split('^^^')) || [];
  links = links.map(l => {
    const s = l.split('%%%');
    return {
      text: s[0],
      url: s[1],
      key: Math.floor(Math.random() * Math.floor(1000000)),
    };
  });
  return links;
}

function convertLinksToAirTable(arr) {
  let linkString = Array.isArray(arr) ? arr : [];
  linkString = linkString.reduce((acc, cv) => `${acc}${acc ? '^^^' : ''}${cv.text}%%%${cv.url}`, '');
  return linkString;
}

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
  const loggedIn = useSelector(state => state.user.token);
  const user = useSelector(state => state.user) || {};
  const uuid = useSelector(state => state.manageRaise.publicUUID) || '';
  const getFounderStatus = useSelector(state => state.manageRaise.getFounderData_status) || '';
  const founderProps = useSelector(state => state.manageRaise.founderData[uuid]) || {};
  const postFounderStatus = founderProps.post_status;
  const searchRaise = useSelector(state => state.search.raise) || 100000;
  const searchRemote = useSelector(state => state.search.remote) || '';
  const updateStatus = useSelector(state => state.user.update_status);
  const deleteStatus = useSelector(state => state.user.delete_status);
  const createBoardStatus = useSelector(state => state.manageRaise.postBoard_status);
  const investorIDs = useSelector(state => state.user.investors) || [];

  const initialInputState = {
    password: '',
    name: founderProps.name || '',
    title: founderProps.primary_job_title || '',
    orgName: founderProps.primary_organization_name || '',
    orgURL: founderProps.primary_organization_homepage || '',
    orgLogoURL: founderProps.primary_organization_logo || '',
    desc: founderProps.description || '',
    linkedin: founderProps.linkedin || '',
    twitter: founderProps.twitter || '',
    permalink: founderProps.permalink || '',
    links: convertLinksFromAirTable(founderProps.links),
    raise: founderProps.raise || searchRaise || 0,
    remote: founderProps.remote !== undefined ? founderProps.remote : searchRemote,
    location: founderProps.location || '',
    teamSize: founderProps.team_size || 1,
  };

  const [{
    password,
    name,
    title,
    orgName,
    orgURL,
    orgLogoURL,
    desc,
    linkedin,
    twitter,
    permalink,
    links,
    raise,
    remote,
    location,
    teamSize,
  }, setState] = useState(initialInputState);

  const accountInputs = {
    password: {
      label: 'New Password',
      type: 'password',
      placeholder: 'password',
      feedback: true,
      formText: 'Enter a password with 8 or more characters, and at least one upper and lower '
        + 'case letter and number.',
      value: password,
    },
  };

  const publicInputs1 = {
    name: {
      label: 'Your Full Name',
      placeholder: 'name',
      value: name,
    },
    title: {
      label: 'Your Title At Your Startup',
      placeholder: 'title',
      value: title,
    },
    orgName: {
      label: 'The Name of Your Startup',
      placeholder: 'startup name',
      value: orgName,
    },
    orgURL: {
      label: 'Your Startup’s Website',
      type: 'url',
      placeholder: 'http://something.com',
      feedback: true,
      value: orgURL,
    },
    orgLogoURL: {
      label: 'A Link to Your Startup’s Logo',
      type: 'url',
      placeholder: 'http://something.com/something.jpg',
      formText: 'You should link to an image that is at least 100 x 100 px, but not larger than '
        + '400 x 400.',
      feedback: true,
      value: orgLogoURL,
    },
  };

  const publicInputs2 = {
    linkedin: {
      label: 'Your LinkedIn Page',
      type: 'url',
      placeholder: 'LinkedIn url',
      feedback: true,
      value: linkedin,
    },
    twitter: {
      label: 'Your Twitter Page',
      type: 'url',
      placeholder: 'Twitter url',
      feedback: true,
      value: twitter,
    },
    permalink: {
      label: 'Your CrunchBase Page',
      type: 'url',
      placeholder: 'CrunchBase url',
      feedback: true,
      value: permalink,
    },
  };

  const publicInputs3 = {
    raise: {
      label: 'How Much You’re Trying to Raise (in Dollars)',
      type: 'number',
      min: 100000,
      placeholder: 'number equal to or higher than 100000',
      feedback: true,
      formText: 'Plese enter a value of at least $100,000.',
      value: raise,
    },
    teamSize: {
      label: 'How Many People Are On Your Team?',
      type: 'number',
      min: 1,
      placeholder: 'number equal to or higher than 1',
      feedback: true,
      value: teamSize,
    },
    location: {
      label: 'Your Location (city, 2 letter state abbreviation)',
      placeholder: 'location',
      formText: 'Use the format "city name, 2 letter state abbreviation."',
      value: location,
    },
    remote: {
      label: 'We’re fully remote',
      type: 'checkbox',
      value: remote,
    },
  };

  const [validated, setValidated] = useState(false);
  const [publicValidated, setPublicValidated] = useState(false);
  const [deletePressed, setDeletePressed] = useState(false);

  const clearState = () => {
    setState({ ...initialInputState });
  };

  const onInputChange = e => {
    // eslint-disable-next-line no-shadow
    const { name, type, checked } = e.target;
    let { value } = e.target;
    if (type === 'checkbox') value = !!checked;
    if (type === 'number') value = Number(value);
    setState(prevState => ({ ...prevState, [name]: value }));
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: types.USER_GET_BOARDUUID_REQUESTED,
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: types.USER_UPDATE_DISSMISSED,
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: types.PUBLIC_GET_FOUNDERDATA_DISMISSED,
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: types.USER_POST_PUBLICBOARD_DISMISSED,
    });
  }, [dispatch]);

  useEffect(() => {
    if (uuid) {
      dispatch({
        type: types.USER_POST_FOUNDERDATA_DISMISSED,
        params: { uuid },
      });
    }
  }, [uuid, dispatch]);

  useEffect(() => {
    if (uuid) {
      dispatch({
        type: types.PUBLIC_GET_FOUNDERDATA_REQUESTED,
        uuid,
      });
    }
  }, [uuid, dispatch]);

  const updateAccount = params => dispatch({
    type: types.USER_UPDATE_REQUESTED,
    params,
  });

  const updateFounderData = params => dispatch({
    type: types.USER_POST_FOUNDERDATA_REQUESTED,
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
    email: user.email,
  });

  const setLinkText = (text, index) => {
    const newLinks = [...links];
    newLinks[index].text = text;
    setState(prevState => ({ ...prevState, links: newLinks }));
  };

  const setLinkURL = (url, index) => {
    const newLinks = [...links];
    newLinks[index].url = url;
    setState(prevState => ({ ...prevState, links: newLinks }));
  };

  const removeLink = i => {
    const newLinks = [...links];
    newLinks.splice(i, 1);
    setState(prevState => ({ ...prevState, links: newLinks }));
  };

  const addLink = () => {
    const newLinks = [
      ...links,
      {
        text: '',
        url: '',
        key: Math.floor(Math.random() * Math.floor(1000000)),
      },
    ];
    setState(prevState => ({ ...prevState, links: newLinks }));
  };

  const handleSubmit = event => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
    if (form.checkValidity() !== false) {
      const params = {};
      if (password) params.password = password;
      updateAccount(params);
    }
  };

  const handlePublicSubmit = event => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    setPublicValidated(true);
    if (form.checkValidity() !== false) {
      const params = {
        uuid,
        id: founderProps.recordID,
        name,
        primary_job_title: title,
        primary_organization_name: orgName,
        primary_organization_homepage: orgURL,
        primary_organization_logo: orgLogoURL,
        description: desc,
        linkedin,
        twitter,
        permalink,
        links: convertLinksToAirTable(links),
        raise,
        remote: !!remote,
        location,
        team_size: teamSize,
      };
      updateFounderData(params);
    }
  };

  const onCreateBoardClick = () => {
    const addInvestors = investorIDs.map(i => ({ uuid: i }));
    dispatch({
      type: types.USER_POST_PUBLICBOARD_REQUESTED,
      params: {
        id: false,
        addInvestors,
        investorParams: {
          stage: 'added',
          published: true,
        },
      },
    });
    dispatch({
      type: types.MODAL_SET_OPEN,
      modal: 'creatingPublicBoard',
    });
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

  if (postFounderStatus === 'pending') {
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
      {loggedIn && (
      <Col xs={12} md={8} className="mr-auto ml-auto">
        <h1 className="text-center mb-4">My Profile</h1>
        <Form
          className="mb-4"
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
        >
          <h2 className="sectionHead">Account Information</h2>
          <div className="mb-2">
            <b>Email Address: </b>
            <span>{user.email}</span>
          </div>
          {Object.keys(accountInputs).map(k => (
            <FormInput
              onChange={onInputChange}
              key={k}
              iKey={k}
              {...accountInputs[k]}
            />
          ))}
          <DismissibleStatus
            status={updateStatus}
            statusPrefix="Updating Account"
            dissmissAction={types.USER_UPDATE_DISSMISSED}
          />
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
        <section className="mb-4">
          <h2 className="sectionHead">Public Data</h2>
          <p>Your profile will be shown on your public FundBoard when it’s published.</p>
          <DismissibleStatus
            status={getFounderStatus}
            showSuccess={false}
            statusPrefix="Fetching Profile"
            dismissParams={{ uuid }}
            dissmissAction={types.PUBLIC_GET_FOUNDERDATA_DISMISSED}
          />
          {uuid ? (
            <Form
              className="mb-4"
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
              <Form.Group controlId="DescriptionInput">
                <Form.Label>A Short Bio or Description</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="More information about you that would be relevant to someone making an intro."
                  name="desc"
                  value={desc}
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
              {links.map((l, i) => (
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
              <DismissibleStatus
                status={postFounderStatus}
                statusPrefix="Updating Profile"
                dismissParams={{ uuid }}
                dissmissAction={types.USER_POST_FOUNDERDATA_DISMISSED}
              />
              <div className="d-flex flex-grow-1 justify-content-end">
                <Button
                  className="btnMobile100"
                  type="submit"
                  data-track="ProfileUpdateFounderData"
                  {...btnProps.updateFounderData}
                >
                  {btnProps.updateFounderData.text}
                </Button>
              </div>
            </Form>
          ) : (
            <div>
              <p className="text-primary">
                Your FundBoard isn’t public yet, create one now to start filling in your profile.
              </p>
              <div className="d-flex">
                <Button
                  variant="secondary"
                  className="txs-3 mr-2 ml-auto"
                  disabled={createBoardStatus === 'pending'}
                  onClick={onCreateBoardClick}
                >
                  Publish Your FundBoard
                </Button>
              </div>
              <DismissibleStatus
                status={createBoardStatus}
                statusPrefix="Creating FundBoard"
                dissmissAction={types.USER_POST_PUBLICBOARD_DISMISSED}
              />
            </div>
          )}
        </section>
        <section className="mb-4">
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
        <section className="mb-4">
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
            dissmissAction={types.USER_UPDATE_DISSMISSED}
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
      )}
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
