import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Row from 'react-bootstrap/Row';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router';
import PersonPublic from '../../components/people/PersonPublic';
import * as types from '../../actions/types';
import DismissibleStatus from '../../components/DismissibleStatus';
import GenericModal from '../../modals/GenericModal';
import WelcomeModal from '../../modals/Welcome';
import { MINPLACE, STAGEPROPS } from '../../constants';

export default function Public(props) {
  const { match } = props;
  const { params } = match;
  const { uuid } = params;

  const loggedIn = useSelector(state => state.user.sessionToken);
  const place = useSelector(state => state.user.place);
  const overridePlace = useSelector(state => state.user.overridePlace);
  const allowIn = loggedIn && typeof place === 'number' && (place <= MINPLACE || overridePlace);
  const modalsSeen = useSelector(state => state.modal.modalsSeen) || [];

  const people = useSelector(state => state.people.records) || {};
  const peopleGetStatus = useSelector(state => state.people.get_status);

  const loggedOutInvestorIDs = useSelector(state => state.investors.loggedOutInvestorIDs) || [];
  const loggedOutInvestors = loggedOutInvestorIDs.map(lo => people[lo]);

  const userEmail = useSelector(state => state.user.email);
  const userUpdateStatus = useSelector(state => state.user.update_status);

  const publicProfileStatus = useSelector(state => state.founders.get_profile_status);
  const publicUserStatus = useSelector(state => state.founders.get_user_status);

  const user = useSelector(state => state.user) || {};
  const pageUUID = uuid || user.uuid;
  const profile = useSelector(state => state.founders.publicFounders[pageUUID]) || {};
  const isMyPage = pageUUID === user.uuid;

  const boardPublic = profile.board_public;
  const getInvestorsStatus = useSelector(state => state.founders.get_investors_status) || '';
  const public_records = useSelector(state => state.founders.publicInvestors) || {};
  const investorIDs = Object.keys(public_records) || [];
  const publicPostIntro = useSelector(state => state.founders.post_intro_status);

  const randomInvestors = useSelector(state => state.search.random) || [];

  const [showConfirmHide, setShowConfirmHide] = useState(false);

  // make sure to show the page uuid in the URL if there is one.
  if (!uuid && pageUUID) {
    window.history.replaceState(null, 'public', `/public/${pageUUID}`);
  }

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
    if (pageUUID) {
      dispatch({
        type: types.PUBLIC_GET_INVESTORS_REQUESTED,
        uuid: pageUUID,
      });
    }
  }, [pageUUID, dispatch]);

  useEffect(() => {
    if (pageUUID) {
      dispatch({
        type: types.PUBLIC_GET_USER_REQUESTED,
        uuid: pageUUID,
      });
    }
  }, [pageUUID, dispatch]);

  useEffect(() => {
    if (pageUUID) {
      dispatch({
        type: types.PUBLIC_GET_PROFILE_REQUESTED,
        uuid: pageUUID,
      });
    }
  }, [pageUUID, dispatch]);

  useEffect(() => {
    const ids = pageUUID ? Object.keys(public_records) : loggedOutInvestorIDs;
    if (ids.length) {
      dispatch({
        type: types.PEOPLE_GET_REQUEST,
        ids,
      });
    } else {
      dispatch({
        type: types.SEARCH_GET_RANDOM_REQUESTED,
        count: 5,
      });
    }
  }, [public_records, dispatch]);

  const investorList = [];

  if (Array.isArray(investorIDs) && investorIDs.length) {
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
  }

  investorList.sort((a, b) => {
    const aName = (a.name && a.name.toLowerCase()) || '';
    const bName = (b.name && b.name.toLowerCase()) || '';
    return aName > bName ? -1 : 1;
  });

  investorList.sort((a, b) => {
    const stageKeys = Object.keys(STAGEPROPS);
    const aStage = a.investorStatus.stage;
    const bStage = b.investorStatus.stage;
    let aRank = stageKeys.indexOf(aStage);
    if (['none', 'added'].includes(aStage)) aRank = 0;
    const bRank = stageKeys.indexOf(bStage);
    return aRank > bRank ? 1 : -1;
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
      modalProps: { ...profile, uuid: pageUUID },
    });
  };

  const history = useHistory();

  const onGoToSearch = () => {
    history.push('introSearch');
  };

  const onGoToLogin = () => {
    dispatch({
      type: types.MODAL_SET_OPEN,
      modal: 'login',
      modalProps: { initialMode: 'create'},
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
      <div className="boardDetailsBar">
        <div className="primaryDetails">
          <div className="d-flex w-100">
            <div className="d-none d-md-block flex-grow-1">
              {profile.name ? (
                <Button
                  variant="text"
                  className="text-left titleLink"
                  type="button"
                  onClick={onClickShowProfile}
                >
                  {`Welcome to the FundBoard of ${profile.name}`}
                </Button>
              ) : (
                <span>Welcome to FundBoard!</span>
              )}
            </div>
            <div className="d-md-none flex-grow-1">
              <button
                className="btn btn-txt titleLink text-left d-inline"
                type="button"
                onClick={onClickShowProfile}
              >
                {profile.name || '_____'}
                <span className="d-md-none">
                  ’s FundBoard
                </span>
              </button>
            </div>
            {isMyPage && allowIn && (
              <div>
                <a
                  href="/board"
                  className="btn btn-link text-secondary-light2 txs-3 text-nowrap"
                >
                  Edit Board
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      {statusBars.map(s => <DismissibleStatus {...s} />)}
      <div>
        {isMyPage && allowIn && (
          <div className="d-flex mb-3">
            <a
              href="/profile"
              className="mr-2"
            >
              Edit Profile
            </a>
            <Button
              variant="link"
              className="txs-1 toggleHideLink ml-auto"
              onClick={onToggleHideBoardClick}
            >
              {`${boardPublic ? 'Hide' : 'Show'} Public Investor List`}
            </Button>
          </div>
        )}
        <div className="results">
          {boardPublic && investorList.length && investorList.map(i => {
            const personProps = {
              ...i,
              founderUUID: pageUUID,
              founderName: profile.name,
              userEmail,
              isMyPage,
            };
            return (
              <PersonPublic key={i.uuid} {...personProps} />
            );
          })}
          {pageUUID && !isMyPage && (!boardPublic || investorList.length === 0) && (
            <div>
              This founder doesn’t have any investors shared publicly yet.
            </div>
          )}
          {!pageUUID && investorList.length < 1 && loggedOutInvestorIDs.length < 1 && (
            <div>
              {randomInvestors.map(i => (
                <PersonPublic
                  key={i.uuid}
                  {...i}
                  investorStatus={{ stage: 'added' }}
                />
              ))}
              <div className="mt-3 mb-4">
                <p>
                  This page is&nbsp;
                  <i>your FundBoard.</i>
                  &nbsp;To get introductions to investors all you have to do is share it.
                </p>
                <p>
                  <strong>Step one is to find the right investors.</strong>
                  &nbsp;The investors above are just examples! They’ll go away after
                  you add some real investors.
                </p>
              </div>
              <div className="d-flex justify-content-center">
                <Button
                  variant="secondary"
                  className="btnNoMax"
                  onClick={onGoToSearch}
                >
                  Find Investors to Add to Your FundBoard
                </Button>
              </div>
            </div>
          )}
          {!pageUUID && (investorList.length || loggedOutInvestorIDs.length) && (
            <div>
              {loggedOutInvestors.map(i => (
                <PersonPublic
                  key={i.uuid}
                  {...i}
                  investorStatus={{ stage: 'added' }}
                />
              ))}
              <div className="mt-3 mb-4">
                <p>
                  You’ve found some investors! Now all you need to do is log in to get a URL you
                  can share with people that might be able to intro you.
                </p>
              </div>
              <div className="d-flex justify-content-center">
                <Button
                  variant="secondary"
                  className="btnNoMax"
                  onClick={onGoToLogin}
                >
                  Make My FundBoard Shareable
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {!pageUUID && !modalsSeen.includes('welcome') && <WelcomeModal />}
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
