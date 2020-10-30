import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import * as types from '../actions/types';
import DismissibleStatus from '../components/DismissibleStatus';

export default function HowToIntro() {
  const publicID = useSelector(state => state.manageRaise.publicUUID);
  const publicURL = `https://fundboard.co/public/${publicID}`;
  const publicStatus = useSelector(state => state.manageRaise.createBoard_status);

  const dispatch = useDispatch();

  const closeModal = () => {
    dispatch({
      type: types.MODAL_SET_OPEN,
      modal: null,
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
      className="modal-createingPublicBoard"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h2 className="h4 h-xs-3 h-sm-2 bold">Creating Your Public Board</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <DismissibleStatus
          status={publicStatus}
          dissmissAction={types.USER_POST_PUBLICBOARD_DISMISSED}
        />
        {publicStatus !== 'succeeded' && (
          <p>Your public, sharable FundBoard is being created.</p>
        )}
        {publicStatus === 'succeeded' && (
          <div>
            <p>Your public, sharable FundBoard is ready!</p>
            <p>
              You can share it with anyone you think might be able to connect you with one of the
              investors on your board. They can &rdquo;claim&ldquo; an introduction and let you know
              they are going to or already have connected you with an investor.
            </p>
            <p>
              You can always edit who says they have introduced you to an investor, and add your own
              information if you were connected outside of FundBoard.
            </p>
            <p>
              Your public URL:
              <a
                href={publicURL}
                target="_blank"
                rel="noreferrer"
              >
                {publicURL}
              </a>
            </p>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}
