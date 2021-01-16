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

  const people = useSelector(state => state.people.records);
  const userPublicUUID = useSelector(state => state.user.uuid);
  const test = useSelector(state => state.user);
  console.log(test);
  const userStatus = useSelector(state => state.user.update_status);

  const founderStatus = useSelector(state => state.founders.get_profile_status);
  const profile = useSelector(state => state.founders.publicFounders[uuid]) || {};
  // const boardStatus = useSelector(state => state.manageRaise.postBoard_status);

  const isMyPage = uuid === userPublicUUID;
  const public_records = useSelector(state => state.founders.publicInvestors) || {};
  console.log(public_records);
  const getInvestorsStatus = useSelector(state => state.founders.get_investors_status) || '';
  const boardPublic = useSelector(state => state.user.board_public);
  const investorIDs = Object.keys(public_records);
  const publicPostIntro = useSelector(state => state.founders.post_intro_status);
  const publicDismissPost = types.PUBLIC_POST_INTRO_DISMISSED;
  // const privatePostStatus = useSelector(state => state.manageRaise.post_status);
  // const privateDismissPost = types.USER_POST_INVESTORSTATUS_DISMISSED;

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
      key: 'founder',
      status: founderStatus,
      showSuccess: false,
      statusPrefix: 'Founder data',
      dissmissAction: types.PUBLIC_GET_PROFILE_DISMISSED,
    },
    {
      key: 'user',
      status: userStatus,
      showSuccess: false,
      statusPrefix: 'User',
      dissmissAction: types.PUBLIC_GET_PROFILE_DISMISSED,
    },
    /*
    {
      key: 'board',
      status: boardStatus,
      dissmissAction: types.USER_POST_PUBLICBOARD_DISMISSED,
    },
     */
    {
      key: 'publicPost',
      status: publicPostIntro,
      statusPrefix: 'Make Introduction:',
      dissmissAction: publicDismissPost,
    },
    /*
    {
      key: 'privatePost',
      status: privatePostStatus,
      statusPrefix: 'Make Introduction:',
      dissmissAction: privateDismissPost,
    },
    */
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
      type: types.USER_UPDATE_DISSMISSED,
    });
    /*
    dispatch({
      type: types.USER_POST_PUBLICBOARD_DISMISSED,
    });
    */
    dispatch({
      type: types.PUBLIC_POST_INTRO_DISMISSED,
    });
    /*
    dispatch({
      type: types.USER_POST_INVESTORSTATUS_DISMISSED,
    });
    */
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: types.PUBLIC_GET_INVESTORS_REQUESTED,
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
        id: ids,
      });
    }
  }, [public_records, dispatch]);

  const investorList = [];

  investorIDs.forEach(i => {
    const person = people[i] ? { ...people[i] } : {};
    const investorStatus = public_records[i] || {};
    investorList.push({
      ...person,
      ...investorStatus, // merge in manual edits
      uuid: i,
      investorStatus,
    });
  });
  console.log(investorList);

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
  console.log(toShowInvestorList);

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
