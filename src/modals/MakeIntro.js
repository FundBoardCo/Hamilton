import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import * as types from '../actions/types';
import Status from '../components/DismissibleStatus';
import EditIntro from './Investor/EditIntro';

export default function MakeIntro() {
  const founderStatus = useSelector(state => state.manageRaise.getFounderData_status) || '';
  const openModal = useSelector(state => state.modal.openModal);
  const modalProps = useSelector(state => state.modal.modalProps);
  const { isPublic, founderID, investor } = modalProps;
  const founderProps = useSelector(state => state.manageRaise.founderData) || {};

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: types.PUBLIC_GET_FOUNDERDATA_REQUESTED,
      uuid: founderID,
    });
  }, [founderID, dispatch]);

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

  const introTitle = isPublic
    ? `Introduce ${founderProps.name} to ${investor.name}`
    : `Introduction to ${investor.name}`;

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
          <h4>{introTitle}</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-0">
        <Status
          statusPrefix="Founder data:"
          showSuccess={false}
          status={founderStatus}
          dissmissAction={types.PUBLIC_GET_FOUNDERDATA_DISMISSED}
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
