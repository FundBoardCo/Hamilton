import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import * as types from '../actions/types';
import DismissibleStatus from '../components/DismissibleStatus';

export default function HowToIntro() {
  const publicID = useSelector(state => state.manageRaise.publicUUID);
  const publicStatus = useSelector(state => state.manageRaise.postBoard_status);

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
        />
        <div>
          {publicStatus !== 'succeeded' && (
            <p>Your public, sharable FundBoard is being created.</p>
          )}
          {publicStatus === 'succeeded' && (
            <p>Your public, sharable FundBoard is ready!</p>
          )}
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
            All of the investors on your personal board have been published to your public
            FundBoard. If you add more investors, they will be set as private until you share them.
            You can mark shared investors as private at any time to take them off your public
            FundBoard.
          </p>
          <p>
            Don’t forget to
            <a href="/profile">add details about you and your startup to your profile</a>
            before sharing it!
          </p>
          {publicStatus === 'succeeded' && (
            <p>
              Your public URL:&nbsp;
              <a
                href={`${window.location.protocol}//${window.location.host}/public/${publicID}`}
                target="_blank"
                rel="noreferrer"
              >
                {`${window.location.protocol}//${window.location.host}/public/${publicID}`}
              </a>
            </p>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}
