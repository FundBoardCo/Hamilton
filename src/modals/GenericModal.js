import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import * as types from '../actions/types';

export default function GenericModal(props) {
  const openModal = useSelector(state => state.modal.openModal);
  const { title, text, buttons } = props;

  const history = useHistory();

  const dispatch = useDispatch();

  const unSetModal = () => dispatch({
    type: types.MODAL_SET_OPEN,
    modal: null,
  });

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
      scrollable
      onHide={closeModal}
      className="modal-createingPublicBoard"
    >
      {title && (
        <Modal.Header closeButton>
          <Modal.Title>
            <h2 className="h4 h-xs-3 h-sm-2 bold">{title}</h2>
          </Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body>
        {text && (
          <p>{text}</p>
        )}
        <div className="d-flex gutter-2 justify-content-end">
          {Array.isArray(buttons) && buttons.length && buttons.map(b => (
            <Button {...b} className="btnNoMax">
              {b.text}
            </Button>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
}

GenericModal.defaultProps = {
  title: '',
  text: '',
  buttons: [],
};

GenericModal.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      text: PropTypes.string,
      variant: PropTypes.string,
      onClick: PropTypes.func,
    }),
  ),
};
