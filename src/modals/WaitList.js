import React from 'react';
import { useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { useHistory } from 'react-router';

export default function HowToIntro() {
  const place = useSelector(state => state.user.place);
  const email = useSelector(state => state.user.email);

  const history = useHistory();

  const closeModal = () => {
    history.goBack();
  };

  return (
    <Modal
      size="lg"
      aria-labelledby="Modal-Title"
      centered
      show
      scrollable
      onHide={closeModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h2 className="h4 h-xs-3 h-sm-2 bold">You’re On Our Waitlist.</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Welcome to FundBoard!
        </p>
        <p>
          During the early stages of our alpha, we’re only allowing a limited numberof users
          access to all our features.
        </p>
        <p>
          {`You’re number ${place} on the waitlist. As soon as we reach your number we’ll send you
          an email at ${email} to let you know the rest of FundBoard is available to you.`}
        </p>
      </Modal.Body>
    </Modal>
  );
}
