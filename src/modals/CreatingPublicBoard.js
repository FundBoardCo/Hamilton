import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { useHistory, useLocation } from 'react-router';
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

  const history = useHistory();

  const onGotoProfile = () => {
    history.push('/profile');
    closeModal();
  };

  const location = useLocation();
  const path = location.pathname.substring(1).split('/')[0];

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
            <p>
              Your FundBoard is ready to share with anyone that can connect you to your saved
              investors. One intro-er can &rdquo;claim&ldquo; each investor to let you know
              they will connect you.
            </p>
          )}
          {publicStatus === 'succeeded' && path !== 'profile' && (
            <p className="d-flex">
              Don’t forget to&nbsp;
              <button
                className="btn btn-link inlineBtn"
                type="button"
                onClick={onGotoProfile}
              >
                add details to your profile
              </button>
              &nbsp;before sharing it!
            </p>
          )}
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
