import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Row from 'react-bootstrap/Row';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import PersonPublic from '../../components/people/PersonPublic';
import * as types from '../../actions/types';
import DismissibleStatus from '../../components/DismissibleStatus';
import GenericModal from '../../modals/GenericModal';
import { STAGEPROPS } from '../../constants';
import { getSafeVar } from '../../utils';

export default function Public(props) {
  const { match } = props;
  const { params } = match;
  const { uuid } = params;

  const getStatus = useSelector(state => state.manageRaise.getPublic_status);
  const boardStatus = useSelector(state => state.manageRaise.postBoard_status);
  const publicUUID = useSelector(state => state.manageRaise.publicUUID);
  const public_records = useSelector(state => state.manageRaise.public_records) || {};
  const founderStatus = useSelector(state => state.manageRaise.getFounder_status) || '';
  const founderProps = useSelector(state => state.manageRaise.founderData) || {};
  const publicIDRecordID = useSelector(state => state.manageRaise.publicUUID_recordID);
  const boardHidden = useSelector(state => state.manageRaise.hidden);
  const isMyPage = uuid === publicUUID;
  const investorIDs = Object.keys(public_records);
  const people = useSelector(state => state.people);
  const publicPostStatus = useSelector(state => state.manageRaise.publicPost_status);

  // if this is a public page, use the public state tracking.
  let postStatus = useSelector(state => state.manageRaise.post_status);
  let dismissPost = types.USER_POST_INVESTORSTATUS_DISMISSED;
  if (!isMyPage) {
    postStatus = publicPostStatus;
    dismissPost = types.PUBLIC_POST_INVESTORSTATUS_DISMISSED;
  }

  const [sortBy, setSortBy] = useState('status');
  const [searchBy, setSearchBy] = useState('');
  const [showConfirmHide, setShowConfirmHide] = useState(false);

  const statusBars = [
    {
      key: 'get',
      status: getStatus,
      showSuccess: false,
      dissmissAction: types.PUBLIC_GET_BOARD_DISMISSED,
    },
    {
      key: 'founder',
      status: founderStatus,
      showSuccess: false,
      dissmissAction: types.PUBLIC_GET_FOUNDER_DISMISSED,
    },
    {
      key: 'board',
      status: boardStatus,
      dissmissAction: types.USER_POST_PUBLICBOARD_DISMISSED,
    },
    {
      key: 'post',
      status: postStatus,
      statusPrefix: 'Make Introduction:',
      dissmissAction: dismissPost,
    },
  ];

  const dispatch = useDispatch();

  // dismiss lingering status bars
  useEffect(() => {
    statusBars.forEach(s => {
      dispatch({
        type: s.dissmissAction,
      });
    });
  }, [statusBars, dispatch]);

  useEffect(() => {
    dispatch({
      type: types.PUBLIC_GET_BOARD_REQUESTED,
      uuid,
    });
  }, [uuid, boardHidden, dispatch]);

  useEffect(() => {
    dispatch({
      type: types.PUBLIC_GET_FOUNDER_REQUESTED,
      uuid: publicUUID,
    });
  }, [publicUUID, dispatch]);

  useEffect(() => {
    const ids = Object.keys(public_records);
    if (ids.length) {
      dispatch({
        type: types.PEOPLE_GET_REQUEST,
        id: ids,
      });
    }
  }, [public_records, dispatch]);

  const investorList = [];
  let toShowInvestorList;

  investorIDs.forEach(i => {
    const person = people[i] ? { ...people[i] } : {};
    const investorStatus = public_records[i] || {};
    investorList.push({
      ...person,
      uuid: i,
      investorStatus,
    });
  });

  investorList.sort((a, b) => {
    if (sortBy === 'status') {
      const stageKeys = Object.keys(STAGEPROPS);
      const aStage = a.investorStatus.stage;
      const bStage = b.investorStatus.stage;
      return stageKeys.indexOf(aStage) > stageKeys.indexOf(bStage) ? 1 : -1;
    }
    return a.name > b.name ? 1 : -1;
  });

  if (searchBy) {
    toShowInvestorList = investorList.filter(i => {
      const org = getSafeVar(() => i.primary_organization.name, '');
      return i.name.toLowerCase().includes(searchBy.toLowerCase())
        || org.toLowerCase().includes(searchBy.toLowerCase());
    });
  } else {
    toShowInvestorList = investorList;
  }

  const toggleHideBoard = () => {
    dispatch({
      type: types.USER_POST_PUBLICBOARD_REQUESTED,
      params: {
        hide: !boardHidden,
        id: publicIDRecordID,
      },
    });
  };

  const onCancelHideClick = () => {
    setShowConfirmHide(false);
  };

  const onConfirmHideClick = () => {
    setShowConfirmHide(false);
    toggleHideBoard();
  };

  const onToggleHideBoardClick = () => {
    if (boardHidden) {
      toggleHideBoard();
    } else {
      setShowConfirmHide(true);
    }
  };

  // TODOS: change hide button to hide/unhide toggle, change saga to toggle.

  const confirmDeleteProps = {
    title: 'Are You Sure?',
    text: 'This will hide your public board, and make all links to it inoperable.',
    buttons: [
      {
        key: 'cancel',
        text: 'Cancel',
        variant: 'danger',
        onClick: onCancelHideClick,
      },
      {
        key: 'confirm',
        text: 'Yes, Hide My Board',
        variant: 'success',
        onClick: onConfirmHideClick,
      },
    ],
  };

  return (
    <Row id="PageBoard" className="pageContainer">
      {showConfirmHide && <GenericModal {...confirmDeleteProps} />}
      <div>
        <div className="boardDetailsBar">
          <div className="primaryDetails">
            <span>
              {`Welcome to the FundBoard of ${founderProps.name}!`}
            </span>
            {isMyPage && (
              <span className="txs-1">
                <Button
                  variant="link"
                  className="txs-1 text-warning"
                  onClick={onToggleHideBoardClick}
                >
                  {`${boardHidden ? 'Show' : 'Hide'} Public Board`}
                </Button>
              </span>
            )}
          </div>
        </div>
        {investorIDs.length > 0 && (
          <div className="d-flex justify-content-end justify-content-lg-end align-items-center mb-3">
            <div className="sortBar">
              <span className="label">Sort By:</span>
              <button
                type="button"
                className={sortBy === 'name' ? 'active' : ''}
                onClick={() => setSortBy('name')}
              >
                ABC
              </button>
              <button
                type="button"
                className={sortBy === 'status' ? 'active' : ''}
                onClick={() => setSortBy('status')}
              >
                Status
              </button>
            </div>
            <div className="searchBar">
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text>
                    Search
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  type="text"
                  value={searchBy}
                  onChange={e => setSearchBy(e.target.value)}
                  aria-label="Search for an investor by name or organization."
                />
              </InputGroup>
            </div>
          </div>
        )}
      </div>
      {statusBars.map(s => <DismissibleStatus {...s} />)}
      <div className="results">
        {toShowInvestorList.map(i => {
          const personProps = {
            ...i,
            sortedBy: sortBy,
            founderID: uuid,
            isMyPage,
          };
          return (
            <PersonPublic key={i.uuid} {...personProps} />
          );
        })}
      </div>
      {investorIDs.length === 0 && (
        <div>
          This founder doesn’t have any investors saved yet.
        </div>
      )}
    </Row>
  );
}

Public.defaultProps = {
  match: {},
};

Public.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.objectOf(PropTypes
      .oneOfType([PropTypes.bool, PropTypes.string, PropTypes.objectOf(PropTypes.string)])),
  }),
};
