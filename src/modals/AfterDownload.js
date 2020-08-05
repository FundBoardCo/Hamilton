import React from 'react';
import { useDispatch } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import * as types from '../actions/types';

export default function AfterDownload() {
  const dispatch = useDispatch();

  const closeModal = () => dispatch({
    type: types.MODAL_SET_OPEN,
    modal: null,
  });

  return (
    <Modal
      size="lg"
      aria-labelledby="Modal-Title"
      centered
      show
      scrollable
      onHide={closeModal}
      className="modal-afterDownload"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          What do I do with my FundBoard?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        test
      </Modal.Body>
    </Modal>
  );
}
