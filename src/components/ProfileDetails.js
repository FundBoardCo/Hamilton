import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, Button } from 'react-bootstrap';
import FormInput from './FormInput';
import DismissibleStatus from './DismissibleStatus';
import * as types from '../actions/types';

const ProfileDetails = props => {
  window.console.log('props are ', props);
  const {
    publicValidated,
    handlePublicSubmit,
    publicInputs1,
    onInputChange,
    showPublicInputs,
    inputState,
    publicInputs2,
    publicInputs3,
    currentUpdate,
    LinkInput,
    setLinkText,
    setLinkURL,
    removeLink,
    addLink,
    updateStatus,
    setShowPublicInputs,
    btnProps,
    updateProfileStatus,
    profile,
  } = props;

  return (
    <Form
      className="mb-5 mb-md-4"
      noValidate
      validated={publicValidated}
      onSubmit={handlePublicSubmit}
    >
      {Object.keys(publicInputs1).map(k => {
        const inputData = publicInputs1;

        if (Object.keys(profile).includes(k)) {
          window.console.log('bingo ', k);
          inputData[k].value = profile[k];
        }

        return (
          <FormInput
            onChange={onInputChange}
            key={k}
            iKey={k}
            {...inputData[k]}
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
  publicValidated: true,
  inputState: {},
  publicInputs1: '',
  onInputChange: '',
  showPublicInputs: true,
  publicInputs2: '',
  publicInputs3: '',
  currentUpdate: '',
  LinkInput: () => {},
  setLinkText: () => {},
  setLinkURL: () => {},
  removeLink: () => {},
  addLink: () => {},
  updateStatus: () => {},
  setShowPublicInputs: () => {},
  btnProps: {},
  handlePublicSubmit: () => {},
  updateProfileStatus: () => {},
  profile: () => {},
};

ProfileDetails.propTypes = {
  publicValidated: PropTypes.bool,
  inputState: PropTypes.shape({
    desc: PropTypes.string,
    linkedin: PropTypes.string,
    links: PropTypes.arrayOf(PropTypes.string),
    location_city: PropTypes.string,
    location_state: PropTypes.string,
    name: PropTypes.string,
    orgLogoURL: PropTypes.string,
    orgName: PropTypes.string,
    orgURL: PropTypes.string,
    password: PropTypes.string,
    permalink: PropTypes.string,
    remote: PropTypes.bool,
    team_size: PropTypes.number,
    title: PropTypes.string,
    twitter: PropTypes.string,
  }),
  publicInputs1: PropTypes.string,
  onInputChange: PropTypes.func,
  showPublicInputs: PropTypes.string,
  publicInputs2: PropTypes.bool,
  publicInputs3: PropTypes.string,
  currentUpdate: PropTypes.string,
  LinkInput: PropTypes.func,
  setLinkText: PropTypes.func,
  setLinkURL: PropTypes.func,
  removeLink: PropTypes.func,
  addLink: PropTypes.func,
  updateStatus: PropTypes.func,
  setShowPublicInputs: PropTypes.func,
  handlePublicSubmit: PropTypes.func,
  btnProps: PropTypes.shape({
    update: PropTypes.shape({
      variant: PropTypes.string,
      text: PropTypes.string,
      disabled: PropTypes.bool,
    }),
    updateFounderData: PropTypes.shape({
      variant: PropTypes.string,
      text: PropTypes.string,
      disabled: PropTypes.bool,
    }),
    logout: PropTypes.shape({
      variant: PropTypes.string,
      text: PropTypes.string,
      disabled: PropTypes.bool,
    }),
    delete: PropTypes.shape({
      variant: PropTypes.string,
      text: PropTypes.string,
      disabled: PropTypes.bool,
    }),
  }),
  updateProfileStatus: PropTypes.func,
  profile: PropTypes.shape({
    createdAt: PropTypes.string,
    desc: PropTypes.string,
    description: PropTypes.string,
    linkedin: PropTypes.string,
    links: [],
    location_city: PropTypes.string,
    location_state: PropTypes.string,
    name: PropTypes.string,
    objectId: PropTypes.string,
    orgLogoURL: PropTypes.string,
    orgName: PropTypes.string,
    orgURL: PropTypes.string,
    password: PropTypes.string,
    permalink: PropTypes.string,
    primary_job_title: PropTypes.string,
    primary_organization_homepage: PropTypes.string,
    primary_organization_logo: PropTypes.string,
    primary_organization_name: PropTypes.string,
    remote: PropTypes.bool,
    team_size: PropTypes.number,
    title: PropTypes.string,
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
