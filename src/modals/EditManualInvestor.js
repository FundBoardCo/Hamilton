import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import * as types from '../actions/types';
import DismissibleStatus from '../components/DismissibleStatus';
import FormInput from '../components/FormInput';

function parseCBLink(str) {
  if (!str) return '';
  return str.replace('http://crunchbase.com/person/', '');
}

export default function EditManualInvestor() {
  const postStatus = useSelector(state => state.investors.postOwnInvestor_status) || '';
  const modalProps = useSelector(state => state.modal.modalProps);
  const userUUID = useSelector(state => state.user.uuid);

  const {uuid, objectId} = modalProps;

  const [validated, setValidated] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: types.USER_POST_INVESTOR_DISMISSED,
    });
  }, [dispatch]);

  const pOrgName = modalProps.primary_organization_name
    || (modalProps.primary_organization && modalProps.primary_organization.value)
    || '';

  let cbLink = modalProps.permalink;
  if (cbLink && !cbLink.startsWith('http://crunchbase.com/person/')) {
    cbLink = `http://crunchbase.com/person/${cbLink}`;
  }

  const initialInputState = {
    name: modalProps.name,
    primary_job_title: modalProps.primary_job_title,
    primary_organization_name: pOrgName,
    linkedin: modalProps.linkedin,
    twitter: modalProps.twitter,
    permalink: cbLink,
    location_city: modalProps.location_city,
    location_state: modalProps.location_state,
  };

  const [{
    name,
    primary_job_title,
    primary_organization_name,
    is_lead_investor,
    linkedin,
    twitter,
    permalink,
    location_city,
    location_state,
  }, setState] = useState(initialInputState);

  const investorInputs = {
    name: {
      label: 'Name',
      placeholder: 'name',
      value: name,
      required: true,
    },
    primary_job_title: {
      label: 'Title',
      placeholder: 'title',
      value: primary_job_title,
    },
    primary_organization_name: {
      label: 'Fund or Organization',
      placeholder: 'fund or organization name',
      value: primary_organization_name,
    },
    is_lead_investor: {
      label: 'Potential Lead Investor?',
      type: 'checkbox',
      value: is_lead_investor,
    },
    linkedin: {
      label: 'LinkedIn Page',
      type: 'url',
      placeholder: 'http://linkedin.com/name',
      feedback: true,
      value: linkedin,
    },
    twitter: {
      label: 'Twitter Page',
      type: 'url',
      placeholder: 'http://twitter.com/handle',
      feedback: true,
      value: twitter,
    },
    permalink: {
      label: 'CrunchBase Page',
      type: 'url',
      placeholder: 'http://crunchbase.com/person/firstname-lastname',
      feedback: true,
      value: permalink,
    },
    location_city: {
      label: 'City',
      placeholder: 'city',
      value: location_city,
    },
    location_state: {
      label: 'State (2 letter abbreviation)',
      placeholder: '--',
      max: 2,
      value: location_state,
    },
  };

  const onInputChange = e => {
    // eslint-disable-next-line no-shadow
    const { name, type, checked } = e.target;
    let { value } = e.target;
    if (type === 'checkbox') value = !!checked;
    if (type === 'number') value = Number(value);
    setState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = event => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
    if (form.checkValidity() !== false) {
      const params = {
        uuid,
        objectId,
        name,
        primary_job_title,
        primary_organization_name,
        is_lead_investor,
        linkedin,
        twitter,
        permalink: parseCBLink(permalink),
        location_city,
        location_state,
        profileUUID: userUUID,
        manuelEdit: true,
      };
      dispatch({
        type: types.USER_POST_INVESTOR_REQUESTED,
        params,
      });
    }
  };

  const closeModal = () => {
    dispatch({
      type: types.MODAL_SET_OPEN,
      modal: null,
    });
  };

  const submitBtnProps = {
    variant: 'secondary',
    text: 'Save',
    disabled: false,
  };

  if (postStatus === 'pending') {
    submitBtnProps.disabled = true;
  }

  return (
    <Modal
      size="lg"
      aria-labelledby="Modal-Title"
      centered
      show
      className="modal-login"
      onHide={closeModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h4>{uuid ? 'Edit Investor' : 'Add Investor'}</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-0">
        <DismissibleStatus
          statusPrefix="Saving investor data:"
          status={postStatus}
          dissmissAction={types.USER_POST_INVESTOR_DISMISSED}
        />
        <Form
          className="mb-4"
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
        >
          {Object.keys(investorInputs).map(k => (
            <FormInput
              onChange={onInputChange}
              key={k}
              iKey={k}
              {...investorInputs[k]}
            />
          ))}
          <div className="d-flex flex-grow-1 justify-content-end">
            <Button
              className="btnMobile100"
              type="submit"
              data-track="ManualInvestorEdit"
              {...submitBtnProps}
            >
              {submitBtnProps.text}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
