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

  const people = useSelector(state => state.people.records) || {};
  console.log(people);
  const peopleGetStatus = useSelector(state => state.people.get_status);
  const userPublicUUID = useSelector(state => state.user.uuid);
  const userUpdateStatus = useSelector(state => state.user.update_status);

  const publicProfileStatus = useSelector(state => state.founders.get_profile_status);
  const publicUserStatus = useSelector(state => state.founders.get_user_status);
  const profile = useSelector(state => state.founders.publicFounders[uuid]) || {};
  const isMyPage = uuid === userPublicUUID;

  const boardPublic = profile.board_public;
  const getInvestorsStatus = useSelector(state => state.founders.get_investors_status) || '';
  const public_records = useSelector(state => state.founders.publicInvestors) || {};
  const investorIDs = Object.keys(public_records) || [];
  const publicPostIntro = useSelector(state => state.founders.post_intro_status);

  const [sortBy, setSortBy] = useState('status');
  const [searchBy, setSearchBy] = useState('');
  const [showConfirmHide, setShowConfirmHide] = useState(false);

  const statusBars = [
    {
      key: 'get',
      status: getInvestorsStatus,
      showSuccess: false,
      statusPrefix: 'Investors',
      dissmissAction: types.PUBLIC_GET_INVESTORS_DISMISSED,
    },
    {
      key: 'founderUser',
      status: publicUserStatus,
      showSuccess: false,
      statusPrefix: 'Founder user data',
      dissmissAction: types.PUBLIC_GET_USER_DISMISSED,
    },
    {
      key: 'founderProfile',
      status: publicProfileStatus,
      showSuccess: false,
      statusPrefix: 'Founder profile data',
      dissmissAction: types.PUBLIC_GET_PROFILE_DISMISSED,
    },
    {
      key: 'user',
      status: userUpdateStatus,
      showSuccess: false,
      statusPrefix: 'User',
      dissmissAction: types.USER_UPDATE_DISSMISSED,
    },
    {
      key: 'publicPost',
      status: publicPostIntro,
      statusPrefix: 'Make Introduction:',
      dissmissAction: types.PUBLIC_POST_INTRO_DISMISSED,
    },
    {
      key: 'peopleGet',
      status: peopleGetStatus,
      showSuccess: false,
      statusPrefix: 'People Records:',
      dissmissAction: types.PEOPLE_GET_DISMISS,
    },
  ];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: types.PUBLIC_GET_INVESTORS_DISMISSED,
    });
    dispatch({
      type: types.PUBLIC_GET_PROFILE_DISMISSED,
    });
    dispatch({
      type: types.PUBLIC_GET_USER_DISMISSED,
    });
    dispatch({
      type: types.USER_UPDATE_DISSMISSED,
    });
    dispatch({
      type: types.PUBLIC_POST_INTRO_DISMISSED,
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: types.PUBLIC_GET_INVESTORS_REQUESTED,
      uuid,
    });
  }, [uuid, dispatch]);

  useEffect(() => {
    dispatch({
      type: types.PUBLIC_GET_USER_REQUESTED,
      uuid,
    });
  }, [uuid, dispatch]);

  useEffect(() => {
    dispatch({
      type: types.PUBLIC_GET_PROFILE_REQUESTED,
      uuid,
    });
  }, [uuid, dispatch]);

  useEffect(() => {
    const ids = Object.keys(public_records);
    if (ids.length) {
      dispatch({
        type: types.PEOPLE_GET_REQUEST,
        ids,
      });
    }
  }, [public_records, dispatch]);

  const investorList = [];

  if (Array.isArray(investorIDs)) {
    investorIDs.forEach(i => {
      const person = people[i] ? { ...people[i] } : {};
      console.log(person);
      const investorStatus = public_records[i] || {};
      investorList.push({
        ...person,
        ...investorStatus, // merge in manual edits
        uuid: i,
        investorStatus,
      });
    });
  }

  investorList.sort((a, b) => {
    if (sortBy === 'status') {
      const stageKeys = Object.keys(STAGEPROPS);
      const aStage = a.investorStatus.stage;
      const bStage = b.investorStatus.stage;
      return stageKeys.indexOf(aStage) > stageKeys.indexOf(bStage) ? 1 : -1;
    }
    return a.name > b.name ? 1 : -1;
  });

  const toShowInvestorList = investorList.filter(i => {
    let include = true;
    if (searchBy) {
      const org = getSafeVar(() => i.primary_organization.name, '');
      include = i.name.toLowerCase().includes(searchBy.toLowerCase())
        || org.toLowerCase().includes(searchBy.toLowerCase());
    }
    return include;
  });

  const toggleHideBoard = () => {
    dispatch({
      type: types.USER_UPDATE_REQUESTED,
      params: {
        board_public: !boardPublic,
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
    if (!boardPublic) {
      toggleHideBoard();
    } else {
      setShowConfirmHide(true);
    }
  };

  const onClickShowProfile = () => {
    dispatch({
      type: types.MODAL_SET_OPEN,
      modal: 'founder',
      modalProps: { ...profile, uuid },
    });
  };

  const confirmDeleteProps = {
    title: 'Are You Sure?',
    text: 'This will hide the investors on your public board. Links to your board will still work.',
    buttons: [
      {
        key: 'cancel',
        text: 'Cancel',
        variant: 'danger',
        onClick: onCancelHideClick,
      },
      {
        key: 'confirm',
        text: 'Yes, Hide My Investors',
        variant: 'success',
        onClick: onConfirmHideClick,
      },
    ],
  };

  return (
    <Row id="PageBoard" className="pageContainer public">
      {showConfirmHide && <GenericModal {...confirmDeleteProps} />}
      <div>
        <div className="boardDetailsBar">
          <div className="primaryDetails">
            {profile.name ? (
              <span className="d-flex">
                <span className="d-none d-md-inline">
                  Welcome to the FundBoard of&nbsp;
                </span>
                <button
                  className="btn btn-text"
                  type="button"
                  onClick={onClickShowProfile}
                >
                  <b className="bold text-secondary">{profile.name}</b>
                </button>
                <span className="d-none d-md-inline">
                  !
                </span>
              </span>
            ) : (
              <span>Welcome!</span>
            )}
            {isMyPage && (
              <span className="txs-1">
                <Button
                  variant="link"
                  className="txs-1 toggleHideLink"
                  onClick={onToggleHideBoardClick}
                >
                  {`${boardPublic ? 'Hide' : 'Show'} Public Investor List`}
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
      <div>
        <div className="results">
          {boardPublic && toShowInvestorList.map(i => {
            const personProps = {
              ...i,
              sortedBy: sortBy,
              founderUUID: uuid,
              isMyPage,
            };
            return (
              <PersonPublic key={i.uuid} {...personProps} />
            );
          })}
        </div>
        {(!boardPublic || toShowInvestorList.length === 0) && (
          <div>
            This founder doesn’t have any investors shared publicly yet.
          </div>
        )}
      </div>
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
