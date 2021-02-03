import React from 'react';
import { useDispatch } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import * as types from '../actions/types';

export default function HowToIntro() {
  const dispatch = useDispatch();

  const closeModal = () => {
    dispatch({
      type: types.MODAL_SET_OPEN,
      modal: null,
    });
    dispatch({
      type: types.MODAL_SEEN,
      modal: 'howToIntro',
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
      className="modal-howToIntro"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <h2 className="h4 h-xs-3 h-sm-2 bold">Time to Find a Lead Investor.</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <dl className="howToIntroList">
          <dt>1</dt>
          <dd>
            Make sure you have at least 20 potential lead investors on your FundBoard.&nbsp;
            If you need more, try adjusting the parameters in your&nbsp;
            <a href="/search/menu">search.</a>
          </dd>
          <dt>2</dt>
          <dd>
            Track your progress on your board. You can track the stage you’re at with each&nbsp;
            investor, what your next step is, and record notes on each one.
          </dd>
          <dt>3</dt>
          <dd>
            Contact friends, mutual contacts, and anyone else you think might be able to&nbsp;
            introduce you to the investors on your FundBoard.
          </dd>
          <dt>4</dt>
          <dd>
            Want more?&nbsp;
            <a
              href="https://www.fundboard.co/our-take/how-to-raise-with-your-fundboard"
              target="_blank"
              rel="noopener noreferrer"
            >
              We&apos;ve written a detailed guide to raising funds with your FundBoard.
            </a>
          </dd>
        </dl>
      </Modal.Body>
    </Modal>
  );
}
