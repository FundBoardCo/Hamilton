import React from 'react';
import { useDispatch } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import * as types from '../actions/types';

export default function Welcome() {
  const dispatch = useDispatch();

  const closeModal = () => {
    dispatch({
      type: types.MODAL_SET_OPEN,
      modal: null,
    });
    dispatch({
      type: types.MODAL_SEEN,
      modal: 'welcome',
    });
  };

  return (
    <Modal
      size="lg"
      aria-labelledby="Modal-Title"
      centered
      show
      scrollable
      onHide={closeModal}
      className="modal-welcome"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h1 className="h4 h-xs-3 h-sm-2 h-md-1 bold">Time to Get Funded</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="h-md-4">
          FundBoard lets you find and share a list of the right investors for you, and get
          introductions to them.
        </p>
        <dl className="welcomeList">
          <dt>1</dt>
          <dd>
            Find investors that want to invest in your startup with our&nbsp;
            <a href="/introSearch">founder-friendly search.</a>
          </dd>
          <dt>2</dt>
          <dd>
            Save investors that match to your FundBoard. This is just for you, they don’t know
            they’re on their list. FundBoard is for founders!
          </dd>
          <dt>3</dt>
          <dd>
            Share your FundBoard with friends, contacts, and anyone else you think might be able
            to introduce you to your matched investors.
          </dd>
          <dt>4</dt>
          <dd>
            Meet investors! You can use our built-in tools to manage your raise or export your
            FundBoard and manage it somewhere else. Close this modal and get started!
          </dd>
        </dl>
      </Modal.Body>
    </Modal>
  );
}
