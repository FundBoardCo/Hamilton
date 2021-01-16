import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import * as types from '../actions/types';
import Status from '../components/DismissibleStatus';
import EditIntro from './Investor/EditIntro';

export default function MakeIntro() {
  const founderStatus = useSelector(state => state.manageRaise.getFounderData_status)
    || '';
  const openModal = useSelector(state => state.modal.openModal);
  const modalProps = useSelector(state => state.modal.modalProps);
  const { founderUUID, investor } = modalProps;
  const founderProps = useSelector(state => state.manageRaise.founderData[founderUUID])
    || {};

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: types.PUBLIC_GET_PROFILE_REQUESTED,
      uuid: founderUUID,
    });
  }, [founderUUID, dispatch]);

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
          <h4>{`I can connect ${founderProps.name} to ${investor.name}`}</h4>
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
