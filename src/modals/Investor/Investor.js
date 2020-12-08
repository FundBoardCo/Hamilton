import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  capitalizeFirstLetter,
} from '../../utils';
import * as types from '../../actions/types';
import InvestorData from './InvestorData';
import InvestorRaise from './InvestorRaise';
import DismissibleStatus from '../../components/DismissibleStatus';

export default function Investor(props) {
  const { match } = props;
  const { params } = match;
  const { uuid } = params;

  const location = useLocation();
  const path = capitalizeFirstLetter(location.pathname.substring(1).split('/')[0]);

  const searchResults = useSelector(state => state.search.results) || {};
  const people = useSelector(state => state.people) || {};
  const manual_records = useSelector(state => state.manageRaise.manual_records) || [];
  const sData = searchResults[uuid] || {};
  const pData = people[uuid] || {};
  const mData = manual_records[uuid] || {};
  const manualRecordID = mData.id;
  const data = { ...pData, ...sData, ...mData };

  const subProps = {
    uuid,
    data,
    path,
    manualRecordID,
  };

  const { name, getStatus } = data;

  const initialMode = path === 'Board' ? 'raise' : 'data';

  const [mode, setMode] = useState(initialMode);

  const investors = useSelector(state => state.user.investors) || [];

  const isOnBoard = investors.includes(uuid);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: types.PEOPLE_GET_REQUEST,
      id: uuid,
    });
  }, [dispatch, uuid]);

  const onToggleMode = () => {
    setMode(mode === 'data' ? 'raise' : 'data');
  };

  const history = useHistory();

  const closeModal = () => {
    history.goBack();
  };

  const addInvestor = () => dispatch({
    type: 'BOARD_ADD',
    id: uuid,
  });

  const removeInvestor = () => dispatch({
    type: 'BOARD_REMOVE',
    id: uuid,
  });

  const toggleInvestor = () => {
    if (isOnBoard) {
      removeInvestor();
    } else {
      addInvestor();
    }
  };

  const addBtnProps = {
    text: isOnBoard ? 'Remove from my Fundboard' : 'Save to my FundBoard',
    bgCol: isOnBoard ? 'bg-warning' : 'bg-secondary',
    track: isOnBoard ? 'remove' : 'add',
    faIcon: isOnBoard ? 'minus' : 'plus',
  };

  return (
    <Modal
      size="lg"
      aria-labelledby="Modal-Title"
      centered
      show
      scrollable
      onHide={closeModal}
      className="modal-profile investor"
    >
      <Modal.Header closeButton>
        <Modal.Title className="sr-only">
          {name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <DismissibleStatus
          status={getStatus}
          showSuccess={false}
          dissmissAction={types.PEOPLE_GET_DISMISS}
          dismissParams={{ ids: [uuid] }}
        />
        {mode === 'data' && <InvestorData {...subProps} /> }
        {mode === 'raise' && <InvestorRaise {...subProps} /> }
      </Modal.Body>
      <Modal.Footer>
        {path === 'Board' && (
          <button
            className="addBtn bg-primary"
            type="button"
            onClick={onToggleMode}
            data-track={`BoardInvestorToggleFrom-${mode}`}
          >
            {mode === 'data' ? 'Show Raise Progress' : 'Show Investor Data'}
          </button>
        )}
        {path !== 'Board' && (
          <button
            className={`addBtn ${addBtnProps.bgCol}`}
            type="button"
            onClick={toggleInvestor}
            data-track={`${path}InvestorAdd-${addBtnProps.track}`}
          >
            <FontAwesomeIcon icon={addBtnProps.faIcon} className="mr-2" />
            {addBtnProps.text}
          </button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

Investor.defaultProps = {
  match: {},
};

Investor.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.objectOf(PropTypes
      .oneOfType([PropTypes.bool, PropTypes.string, PropTypes.objectOf(PropTypes.string)])),
  }),
};
