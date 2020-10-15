import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import * as types from '../actions/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function HowToIntro() {
  const actions = useSelector(state => state.modal.actions);
  const { onCSVClick } = actions;
  const investorIDs = useSelector(state => state.board.ids) || [];

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
            Track your progress by&nbsp;
            <Button
              className="inlineBtn"
              variant="link"
              onClick={onCSVClick}
              data-track="BoardDownloadText"
            >
              downloading this spreadsheet,
            </Button>
            and saving it locally, or to a shareable platform like Google Sheets. We&apos;ll&nbsp;
            automatically add the columns for the steps you need to take.
          </dd>
          <dt>3</dt>
          <dd>
            Contact friends, mutual contacts, and anyone else you think might be able to&nbsp;
            introduce you to the investors on your FundBoard, and track your progress on the&nbsp;
            spreadsheet you downloaded.
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
        <div className="d-flex justify-content-center">
          <Button
            className="primaryDetailsLink txs-3 h-lg-3 btnNoMax"
            variant="secondary"
            onClick={onCSVClick}
            disabled={investorIDs.length === 0}
            data-track="BoardDownload"
          >
            <FontAwesomeIcon icon="file-download" />
            <span className="ml-2">Download My Investors</span>
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
