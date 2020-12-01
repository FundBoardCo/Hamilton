import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import * as types from '../../actions/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DismissibleStatus from '../../components/DismissibleStatus';

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
  // GIANT FING TODO: make a component with it's own state so it doesnt lose focus when changing
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
  const {
    email,
  } = user;
  const uuid = useSelector(state => state.manageRaise.publicUUID) || '';
  const getFounderStatus = useSelector(state => state.manageRaise.getFounderData_status) || '';
  const founderProps = useSelector(state => state.manageRaise.founderData[uuid]) || {};
  const postFounderStatus = founderProps.post_status;
  const searchRaise = useSelector(state => state.search.raise) || 100000;
  const searchLocation = useSelector(state => state.search.location) || '';
  const searchRemote = useSelector(state => state.search.remote) || '';
  const updateStatus = useSelector(state => state.user.update_status);
  const deleteStatus = useSelector(state => state.user.delete_status);

  const [validated, setValidated] = useState(false);
  const [publicValidated, setPublicValidated] = useState(false);
  const [emailValue, setEmailValue] = useState(email);
  const [password, setPassword] = useState('');
  const [name, setName] = useState(founderProps.name || '');
  const [title, setTitle] = useState(founderProps.primary_job_title || '');
  const [orgName, setOrgName] = useState(founderProps.primary_organization_name || '');
  const [orgURL, setOrgURL] = useState(founderProps.primary_organization_homepage || '');
  const [orgLogoURL, setOrgLogoURL] = useState(founderProps.primary_organization_logo || '');
  const [desc, setDesc] = useState(founderProps.description || '');
  const [linkedin, setLinkedin] = useState(founderProps.linkedin || '');
  const [twitter, setTwitter] = useState(founderProps.twitter || '');
  const [permalink, setPermalink] = useState(founderProps.permalink || '');
  const [links, setLinks] = useState(convertLinksFromAirTable(founderProps.links));
  const [raise, setRaise] = useState(founderProps.raise || searchRaise || 0);
  const [remote, setRemote] = useState(founderProps.remote !== undefined
    ? founderProps.remote
    : searchRemote);
  const [location, setLocation] = useState(founderProps.location || searchLocation || '');
  const [teamSize, setTeamSize] = useState(founderProps.team_size || 1);
  const [deletePressed, setDeletePressed] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: types.USER_UPDATE_DISSMISSED,
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: types.USER_POST_FOUNDERDATA_DISMISSED,
      params: { uuid },
    });
  }, [uuid, dispatch]);

  useEffect(() => {
    dispatch({
      type: types.PUBLIC_GET_FOUNDERDATA_REQUESTED,
      uuid,
    });
  }, [uuid, dispatch]);

  const updateAccount = params => dispatch({
    type: types.USER_UPDATE_REQUESTED,
    params,
  });

  const updateFounderData = params => dispatch({
    type: types.USER_POST_FOUNDERDATA_REQUESTED,
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

  const setLinkText = (text, index) => {
    const newLinks = [...links];
    newLinks[index].text = text;
    setLinks(newLinks);
  };

  const setLinkURL = (url, index) => {
    const newLinks = [...links];
    newLinks[index].url = url;
    setLinks(newLinks);
  };

  const removeLink = i => {
    const newLinks = [...links];
    newLinks.splice(i, 1);
    setLinks(newLinks);
  };

  const addLink = () => {
    setLinks([...links, { text: '', url: '' }]);
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
              Enter a password with 8 or more characters, and at least one upper and lower case
              letter and number.
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              Please enter a valid password.
            </Form.Control.Feedback>
          </Form.Group>
          <DismissibleStatus
            status={updateStatus}
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
          <p>Anything you add below will be shown on your public FundBoard when it’s published.</p>
          <DismissibleStatus
            status={getFounderStatus}
            showSuccess={false}
            dismissParams={{ uuid }}
            dissmissAction={types.PUBLIC_GET_FOUNDERDATA_DISMISSED}
          />
          <Form
            className="mb-4"
            noValidate
            validated={publicValidated}
            onSubmit={handlePublicSubmit}
          >
            <Form.Group controlId="NameInput">
              <Form.Label>Your Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={e => setName(e.target.value)}
                data-track="ProfileName"
              />
            </Form.Group>
            <Form.Group controlId="TitleInput">
              <Form.Label>Your Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your title at your startup"
                value={title}
                onChange={e => setTitle(e.target.value)}
                data-track="ProfileTitle"
              />
            </Form.Group>
            <Form.Group controlId="OrgNameInput">
              <Form.Label>Your Startup</Form.Label>
              <Form.Control
                type="text"
                placeholder="The name of your startup"
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
                data-track="ProfileOrgName"
              />
            </Form.Group>
            <Form.Group controlId="OrgURL">
              <Form.Label>Your Startup Website</Form.Label>
              <Form.Control
                type="url"
                placeholder="The url for your startup"
                value={orgURL}
                onChange={e => setOrgURL(e.target.value)}
                data-track="ProfileOrgURL"
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid url.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="OrgLogoURL">
              <Form.Label>A Link to Your Startup’s Logo</Form.Label>
              <Form.Control
                type="url"
                placeholder="The url for your startup logo"
                value={orgLogoURL}
                onChange={e => setOrgLogoURL(e.target.value)}
                data-track="ProfileOrgLogoURL"
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid url.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="DescriptionInput">
              <Form.Label>A Short Bio or Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="More information about you that would be relevant to investors."
                value={desc}
                onChange={e => setDesc(e.target.value)}
                data-track="ProfileDescription"
              />
            </Form.Group>
            <Form.Group controlId="LinkedinInput">
              <Form.Label>Your LinkedIn Page</Form.Label>
              <Form.Control
                type="url"
                placeholder="The url for your page on LinkedIn"
                value={linkedin}
                onChange={e => setLinkedin(e.target.value)}
                data-track="ProfileLinkedin"
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid url.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="TwitterInput">
              <Form.Label>Your Twitter Page</Form.Label>
              <Form.Control
                type="url"
                placeholder="The url for your page on Twitter"
                value={twitter}
                onChange={e => setTwitter(e.target.value)}
                data-track="ProfileTwitter"
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid url.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="CrunchBaseInput">
              <Form.Label>Your CrunchBase Page</Form.Label>
              <Form.Control
                type="url"
                placeholder="The url for your page on CrunchBase"
                value={permalink}
                onChange={e => setPermalink(e.target.value)}
                data-track="ProfileCrunchBase"
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid url.
              </Form.Control.Feedback>
            </Form.Group>
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
            <Form.Group controlId="RaiseInput">
              <Form.Label>How Much You’re Trying to Raise (in Dollars)</Form.Label>
              <Form.Control
                type="number"
                placeholder={0}
                value={raise}
                min={100000}
                onChange={e => setRaise(e.target.value)}
                data-track="ProfileRaise"
              />
              <Form.Text>
                Minimum of $100,000
              </Form.Text>
              <Form.Control.Feedback type="invalid">
                Please enter a valid number larger than or equal to 100000.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="LocationInput">
              <Form.Label>Your Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="The city and state you're in"
                value={location}
                onChange={e => setLocation(e.target.value)}
                data-track="ProfileLocation"
              />
              <Form.Text>
                Use the format &ldquo;city name, 2 letter state abbreviation.&rdquo;
              </Form.Text>
            </Form.Group>
            <Form.Group
              controlId="RemoteCheckbox"
              className="mb-4"
            >
              <Form.Check
                type="checkbox"
                label="We're fully remote."
                checked={remote}
                onChange={e => setRemote(e.target.checked)}
                data-track="ProfileRemote"
              />
            </Form.Group>
            <Form.Group controlId="TeamSizeInput">
              <Form.Label>How Many People are on Your Team?</Form.Label>
              <Form.Control
                type="number"
                placeholder={1}
                value={teamSize}
                min={1}
                onChange={e => setTeamSize(e.target.value)}
                data-track="ProfileTeamSize"
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid number larger than or equal to 1.
              </Form.Control.Feedback>
            </Form.Group>
            <DismissibleStatus
              status={postFounderStatus}
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
