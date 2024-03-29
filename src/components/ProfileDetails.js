import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, Button } from 'react-bootstrap';
import is from 'is_js';
import FormInput from './FormInput';
import DismissibleStatus from './DismissibleStatus';
import btnProps from '../utils/profileUtils';
import LinkInput from './LinkInput';
import * as types from '../actions/types';

const profileInputs = [
  {
    field: 'name',
    label: 'Your Full Name',
    placeholder: 'name',
    section: 'one',
  },
  {
    field: 'primary_job_title',
    label: 'Your Title At Your Startup',
    placeholder: 'title',
    section: 'one',
  },
  {
    field: 'primary_organization_name',
    label: 'The Name of Your Startup',
    placeholder: 'startup name',
    section: 'one',
  },
  {
    field: 'primary_organization_homepage',
    label: 'Your Startup’s Website',
    type: 'url',
    placeholder: 'http://something.com',
    feedback: true,
    section: 'one',
  },
  {
    field: 'primary_organization_logo',
    label: 'A Link to Your Startup’s Logo',
    type: 'url',
    placeholder: 'https://something.com/something.jpg',
    formText: 'You should link to an image that is at least 100 x 100 px, but not larger than '
      + '400 x 400.',
    feedback: true,
    section: 'one',
  },
  {
    field: 'linkedin',
    label: 'Your LinkedIn Page',
    type: 'url',
    placeholder: 'Enter url, e.g. https://www.linkedin.com/in/yourhandle',
    feedback: true,
    section: 'two',
  },
  {
    field: 'twitter',
    label: 'Your Twitter Page',
    type: 'url',
    placeholder: 'Enter url, e.g. https://www.twitter.com/yourhandle',
    feedback: true,
    section: 'two',
  },
  {
    field: 'permalink',
    label: 'Your CrunchBase Page',
    type: 'url',
    placeholder: 'Enter url, e.g. https://www.crunchbase.com/yourhandle',
    feedback: true,
    section: 'two',
  },
  {
    field: 'team_size',
    label: 'How Many People Are On Your Team?',
    type: 'number',
    min: 1,
    placeholder: 'number equal to or higher than 1',
    feedback: true,
    section: 'three',
  },
  {
    field: 'location_city',
    label: 'Your City (HQ, or personal if fully remote)',
    placeholder: 'City',
    section: 'three',
  },
  {
    field: 'location_state',
    label: 'Your State',
    placeholder: 'XX',
    formText: 'Use a 2 letter state abbreviation.',
    pattern: '[A-Z]{2}',
    section: 'three',
  },
  {
    field: 'remote',
    label: 'We’re fully remote',
    type: 'checkbox',
    section: 'three',
  },
];

const ProfileDetails = props => {
  const { profile } = props;
  const [inputState, setInputState] = useState(profile);
  const [currentUpdate, setCurrentUpdate] = useState();
  const [publicValidated, setPublicValidated] = useState(false);
  const [showPublicInputs, setShowPublicInputs] = useState(false);
  const updateProfileStatus = useSelector(state => state.user.updateProfile_status);
  const updateStatus = useSelector(state => state.user.update_status);

  const publicInputs1 = profileInputs.filter(el => el.section === 'one');
  const publicInputs2 = profileInputs.filter(el => el.section === 'two');
  const publicInputs3 = profileInputs.filter(el => el.section === 'three');

  const dispatch = useDispatch();

  const updateFounderData = params => dispatch({
    type: types.USER_POST_PROFILE_REQUESTED,
    params,
  });

  const onInputChange = e => {
    // eslint-disable-next-line no-shadow
    const { name, type, checked } = e.target;
    let { value } = e.target;
    if (type === 'checkbox') value = !!checked;
    if (type === 'number') value = Number(value);

    setInputState(prevState => ({ ...prevState, [name]: value }));
  };

  const handlePublicSubmit = event => {
    setCurrentUpdate('public');
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    setPublicValidated(true);
    if (form.checkValidity() !== false) {
      const params = {
        ...inputState,
        remote: !!inputState.remote,
      };
      updateFounderData(params);
    }
  };

  const checkLinks = Array.isArray(inputState.links)
    && inputState.links.length ? inputState.links : [];

  const setLinkText = (text, index) => {
    const newLinks = [...checkLinks];
    newLinks[index].text = text;
    setInputState(prevState => ({ ...prevState, links: newLinks }));
  };

  const setLinkURL = (url, index) => {
    const newLinks = [...checkLinks];
    newLinks[index].url = url;
    setInputState(prevState => ({ ...prevState, links: newLinks }));
  };

  const removeLink = i => {
    const newLinks = [...checkLinks];
    newLinks.splice(i, 1);
    setInputState(prevState => ({ ...prevState, links: newLinks }));
  };

  const addLink = () => {
    const newLinks = [
      ...checkLinks,
      {
        text: '',
        url: '',
        key: Math.floor(Math.random() * Math.floor(1000000)),
      },
    ];
    setInputState(prevState => ({ ...prevState, links: newLinks }));
  };

  useEffect(() => {
    setInputState(profile);
  }, [profile]);

  return (
    <Form
      className="mb-5 mb-md-4"
      noValidate
      validated={publicValidated}
      onSubmit={handlePublicSubmit}
    >
      {publicInputs1.map(k => {
        const inputData = { ...k };
        inputData.value = inputState[k.field] || '';

        return (
          <FormInput
            onChange={onInputChange}
            key={k.field}
            iKey={k.field}
            {...inputData}
          />
        );
      })}
      {showPublicInputs && (
        <div>
          <Form.Group controlId="DescriptionInput">
            <Form.Label>A Short Bio or Description</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="More information about you that would be relevant to someone making an intro."
              name="description"
              value={inputState.description || ''}
              onChange={e => onInputChange(e)}
              data-track="ProfileDescription"
            />
          </Form.Group>
          {publicInputs2.map(k => {
            const inputData = { ...k };
            inputData.value = inputState[k.field] || '';

            return (
              <FormInput
                onChange={onInputChange}
                key={k.field}
                iKey={k.field}
                {...inputData}
              />
            );
          })}
          <h5>Additional Links</h5>
          {
            checkLinks.map((l, i) => (
              <LinkInput
                text={l.text}
                url={l.url}
                key={l.key}
                linkIndex={i}
                onLinkTextChange={setLinkText}
                onLinkURLChange={setLinkURL}
                onLinkRemove={removeLink}
              />
            ))
          }
          <Button
            variant="link"
            className="text-secondary mb-4"
            type="button"
            onClick={addLink}
            data-track="ProfileAddLink"
            disabled={!inputState.links.every(el => el.text && is.url(el.url))}
          >
            Add another link
          </Button>
          {publicInputs3.map(k => {
            const inputData = { ...k };
            inputData.value = inputState[k.field] || '';

            return (
              <FormInput
                onChange={onInputChange}
                key={k.field}
                iKey={k.field}
                {...inputData}
              />
            );
          })}
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
          data-track={`ProfileShowOptions-${
            showPublicInputs ? 'Hide' : 'Show'
          }`}
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
  );
};

ProfileDetails.defaultProps = {
  profile: '',
};

ProfileDetails.propTypes = {
  profile: PropTypes.shape({
    createdAt: PropTypes.string,
    description: PropTypes.string,
    linkedin: PropTypes.string,
    links: [],
    location_city: PropTypes.string,
    location_state: PropTypes.string,
    name: PropTypes.string,
    permalink: PropTypes.string,
    primary_job_title: PropTypes.string,
    primary_organization_homepage: PropTypes.string,
    primary_organization_logo: PropTypes.string,
    primary_organization_name: PropTypes.string,
    remote: PropTypes.bool,
    team_size: PropTypes.number,
    twitter: PropTypes.string,
    updatedAt: PropTypes.string,
    user: PropTypes.shape({
      username: PropTypes.string,
      email: PropTypes.string,
      uuid: PropTypes.string,
      board_public: true,
      createdAt: PropTypes.string,
    }),
    uuid: PropTypes.string,
  }),
};

export default ProfileDetails;
