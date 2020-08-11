import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import * as types from '../actions/types';
import DissmissibleStatus from '../components/DissmissibleStatus';

export default function AfterDownload() {
  const itemId = '5f32b22bf8e8020679adebfc';
  const item = useSelector(state => state.info[itemId]) || {};
  const { status, data = {} } = item;
  console.log(status)
  console.log(data)

  const dispatch = useDispatch();

  const closeModal = () => dispatch({
    type: types.MODAL_SET_OPEN,
    modal: null,
  });

  useEffect(() => {
    dispatch({
      type: 'INFO_GET_REQUEST',
      params: { itemId },
    });
  }, [dispatch, itemId]);

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
          <h2>{data.name}</h2>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <DissmissibleStatus
          status={status}
          showSuccess={false}
          dissmissAction={types.SEARCH_GET_RESULTS_DISMISSED}
          dismissParams={{ itemId }}
        />
        <div dangerouslySetInnerHTML={{ __html: data['tip-body'] }} />
      </Modal.Body>
    </Modal>
  );
}
