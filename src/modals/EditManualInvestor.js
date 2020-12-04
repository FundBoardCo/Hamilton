import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import * as types from '../actions/types';
import DismissibleStatus from '../components/DismissibleStatus';
import FormInput from '../components/FormInput';

export default function EditManualInvestor() {
  const postStatus = useSelector(state => state.manageRaise.manualInvestorPost_status);
  const modalProps = useSelector(state => state.modal.modalProps);

  const { uuid, recordID } = modalProps;

  const [validated, setValidated] = useState(false);

  const initialInputState = {
    name: modalProps.name,
    primary_job_title: modalProps.primary_job_title,
    primary_organization_name: modalProps.primary_organization_name,
    is_lead_investor: modalProps.is_lead_investor,
    linkedin: modalProps.linkedin,
    twitter: modalProps.twitter,
    permalink: modalProps.permalink,
    location: modalProps.location,
  };

  const [{
    name,
    primary_job_title,
    primary_organization_name,
    is_lead_investor,
    linkedin,
    twitter,
    permalink,
    location,
  }, setState] = useState(initialInputState);

  const investorInputs = {
    name: {
      label: 'Name',
      placeholder: 'name',
      value: name,
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
      placeholder: 'url',
      feedback: true,
      value: linkedin,
    },
    twitter: {
      label: 'Twitter Page',
      type: 'url',
      placeholder: 'url',
      feedback: true,
      value: twitter,
    },
    permalink: {
      label: 'CrunchBase Page',
      type: 'url',
      placeholder: 'url',
      feedback: true,
      value: permalink,
    },
    location: {
      label: 'Location',
      placeholder: 'City, XX',
      formText: 'Enter as "City, 2-letter State Abbreviation" to get match data.',
      feedback: true,
      value: location,
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

  const dispatch = useDispatch();

  const handleSubmit = event => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
    if (form.checkValidity() !== false) {
      const params = {
        uuid,
        id: recordID,
        name,
        primary_job_title,
        primary_organization_name,
        linkedin,
        twitter,
        permalink,
        location,
      };
      dispatch({
        type: types.USER_POST_MANUALINVESTOR_REQUESTED,
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
          dissmissAction={types.USER_POST_MANUALINVESTOR_DISMISSED}
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
