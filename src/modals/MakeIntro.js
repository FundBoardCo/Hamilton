import React from 'react';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import * as types from '../actions/types';
import Status from '../components/DismissibleStatus';
import EditIntro from './Investor/EditIntro';

export default function MakeIntro() {
  const openModal = useSelector(state => state.modal.openModal);
  const modalProps = useSelector(state => state.modal.modalProps);
  const { founderName, investor } = modalProps;
  const founderStatus = useSelector(state => state.founders.get_profile_status)
    || '';

  const orgName = investor.primary_organization_name
    || (investor.primary_organization && investor.primary_organization.name)
    || (investor.primary_organization && investor.primary_organization.value)
    || '';

  const connectName = founderName || 'this founder';
  const orgString = orgName ? ` at ${orgName}` : '';
  const connectString = `I can connect ${connectName} to ${investor.name}${orgString}`;

  const dispatch = useDispatch();

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
          <h4>{connectString}</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-0">
        <Status
          statusPrefix="Founder data:"
          showSuccess={false}
          status={founderStatus}
          dissmissAction={types.PUBLIC_GET_PROFILE_DISMISSED}
        />
        <EditIntro
          {...modalProps}
          onSubmit={() => closeModal()}
          onCancel={() => closeModal()}
        />
      </Modal.Body>
    </Modal>
  );
}
