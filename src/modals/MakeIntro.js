import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import * as types from '../actions/types';
import Status from '../components/DismissibleStatus';

export default function MakeIntro() {
  const postStatus = useSelector(state => state.manageRaise.publicPost_status) || '';
  const founderStatus = useSelector(state => state.manageRaise.getFounder_status) || '';

  const openModal = useSelector(state => state.modal.openModal);
  const modalProps = useSelector(state => state.modal.modalProps);
  const { isPublic, founderID, investor } = modalProps;
  const founderProps = useSelector(state => state.manageRaise.founderData) || {};
  console.log(founderProps)

  const [validated, setValidated] = useState(false);

  const [nameVal, setNameVal] = useState('');
  const [emailVal, setEmailVal] = useState('');
  const [dateVal, setDateVal] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: types.PUBLIC_GET_FOUNDER_REQUESTED,
      uuid: founderID,
    });
  }, [dispatch]);

  const updateStatus = params => dispatch({
    type: types.PUBLIC_POST_INVESTORSTATUS_REQUESTED,
    params,
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
      const p = {
        id: modalProps.id,
        intro_name: nameVal,
        intro_email: emailVal,
        stage: 'connected',
        //intro_date: dateVal,
      };
      updateStatus(p);
    }
  };

  const onNameChange = e => {
    setNameVal(e.target.value);
  };

  const onEmailChange = e => {
    setEmailVal(e.target.value);
  };

  const onDateChange = e => {
    setDateVal(e.target.value);
  };

  const introTitle = isPublic
    ? `Introduce ${founderProps.name} to ${investor.name}`
    : `Introduction to ${investor.name}`;

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
          <h2>{introTitle}</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Status
          statusPrefix="Founder data:"
          showSuccess={false}
          status={founderStatus}
          dissmissAction={types.PUBLIC_GET_FOUNDER_DISMISSED}
        />
        <Form
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
        >
          <Form.Group controlId="NameInput">
            <Form.Label className="sr-only">Name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder={isPublic ? 'Your name' : 'Name'}
              value={nameVal}
              onChange={e => onNameChange(e)}
              data-track="MakeIntro-Name"
            />
            <Form.Control.Feedback type="invalid">
              Please enter a valid name.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="EmailInput">
            <Form.Label className="sr-only">Email Address</Form.Label>
            <Form.Control
              required
              type="email"
              placeholder="email address"
              value={emailVal}
              onChange={e => onEmailChange(e)}
              data-track="MakeIntro-Email"
            />
            <Form.Control.Feedback type="invalid">
              Please enter a valid email address.
            </Form.Control.Feedback>
          </Form.Group>


          <Status
            statusPrefix="Make Introduction:"
            showSuccess
            status={postStatus}
            dissmissAction={types.PUBLIC_POST_INVESTORSTATUS_DISMISSED}
          />
          <div className="footerBtnWrapper">
            <Button
              variant="danger"
              className="mr-3 btnNoMax"
              data-track="MakeIntro-Cancel"
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              className="btnNoMax"
              data-track="MakeIntro-Save"
              onClick={handleSubmit}
            >
              Save
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
