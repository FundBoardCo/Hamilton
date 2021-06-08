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

  const loggedIn = useSelector(state => state.user.sessionToken);
  const userUUID = useSelector(state => state.user.uuid);
  const searchResults = useSelector(state => state.search.results) || {};
  const people_records = useSelector(state => state.people.records) || {};
  const investorStatus = useSelector(state => state.investors.ownInvestors[uuid]) || {};
  const sData = searchResults.filter(s => s.uuid === uuid)[0] || {};
  const pData = people_records[uuid] || {};
  const data = { ...pData, ...sData, ...investorStatus };
  const loggedOutInvestorIDs = useSelector(state => state.investors.loggedOutInvestorIDs) || [];
  const ownInvestors = useSelector(state => state.investors.ownInvestors) || {};

  const subProps = {
    uuid,
    data,
    path,
  };

  const { name, getStatus } = data;

  const ownInvestorsIDs = Object.keys(ownInvestors);

  const investors = [...loggedOutInvestorIDs, ...ownInvestorsIDs];

  const isOnBoard = investors.includes(uuid);

  const [mode, setMode] = useState(isOnBoard && loggedIn ? 'raise' : 'data');

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: types.PEOPLE_GET_REQUEST,
      ids: [uuid],
    });
  }, [dispatch, uuid]);

  useEffect(() => {
    if (loggedIn) {
      dispatch({
        type: types.USER_GET_INVESTORS_REQUESTED,
      });
    }
  }, [dispatch, loggedIn]);

  const onToggleMode = m => {
    let newMode = m;
    if (!newMode) newMode = mode === 'data' ? 'raise' : 'data';
    setMode(newMode);
  };

  const history = useHistory();

  const closeModal = () => {
    history.goBack();
  };

  const addInvestor = () => {
    dispatch({
      type: loggedIn ? types.USER_POST_INVESTOR_REQUESTED : types.BOARD_ADD,
      uuid,
      params: {
        uuid,
        stage: 'added',
        profileUUID: userUUID,
        name: data.name,
      },
    });
    if (loggedIn) {
      onToggleMode('raise');
    } else {
      history.goBack();
      dispatch({
        type: types.MODAL_SET_OPEN,
        modal: 'login',
        modalProps: { initialMode: 'create' },
      });
    }
  };

  const removeInvestor = () => dispatch({
    type: loggedIn ? types.USER_POST_INVESTOR_REQUESTED : types.BOARD_REMOVE,
    uuid,
    params: {
      uuid,
      stage: 'archived',
      profileUUID: userUUID,
    },
  });

  const toggleInvestor = () => {
    if (isOnBoard) {
      removeInvestor();
    } else {
      addInvestor();
    }
  };

  const [variant, setVariant] = useState();

  async function activateOptimize() {
    if (window.dataLayer) {
      await window.dataLayer.push({ event: 'optimize.activate' });
      let tries = 0;
      let optVar;
      const intervalId = setInterval(() => {
        if (window.google_optimize !== undefined) {
          optVar = window.google_optimize.get('znMZZp0yS46z9_j-FFGhlw');
        }
        if (optVar !== undefined) {
          setVariant(optVar);
          clearInterval(intervalId);
        } else if (tries >= 5) {
          setVariant(0);
          clearInterval(intervalId);
        } else {
          tries += 1;
        }
      }, 100);
    }
  }

  useEffect(() => {
    activateOptimize();
  }, []);

  let addBtnExperiment = {
    text: '...',
    icon: '',
  };

  if (variant === 0) {
    addBtnExperiment = {
      text: 'Save to my FundBoard',
      icon: 'plus',
    };
  }

  if (variant === 1) {
    addBtnExperiment = {
      text: 'Pin to my FundBoard',
      icon: 'thumbtack',
    };
  }

  const addBtnProps = {
    text: isOnBoard ? 'Remove from my Fundboard' : addBtnExperiment.text,
    bgCol: isOnBoard ? 'bg-warning' : 'bg-secondary',
    track: isOnBoard ? 'remove' : 'add',
    faIcon: isOnBoard ? 'minus' : addBtnExperiment.icon,
    track_exp: variant,
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
          statusPrefix="Loading investor data"
          dissmissAction={types.PEOPLE_GET_DISMISS}
          dismissParams={{ ids: [uuid] }}
        />
        {mode === 'data' && <InvestorData {...subProps} /> }
        {mode === 'raise' && <InvestorRaise {...subProps} /> }
      </Modal.Body>
      <Modal.Footer>
        {isOnBoard && loggedIn ? (
          <button
            className="addBtn bg-primary"
            type="button"
            onClick={() => onToggleMode()}
            data-track={`BoardInvestorToggleFrom-${mode}`}
          >
            {mode === 'data' ? 'Show Raise Progress' : 'Show Investor Data'}
          </button>
        ) : (
          <button
            className={`addBtn ${addBtnProps.bgCol}`}
            type="button"
            onClick={toggleInvestor}
            data-track={`${path}InvestorAdd-${addBtnProps.track}`}
            data-track-exp={addBtnProps.track_exp}
          >
            {addBtnProps.faIcon && (
              <FontAwesomeIcon icon={addBtnProps.faIcon} className="mr-2" />
            )}
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
