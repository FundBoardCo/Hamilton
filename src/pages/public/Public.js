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
import { MINPLACE, STAGEPROPS } from '../../constants';
import ExampleOfIntro from '../../imgs/ExampleOfIntro.jpg';
import ExampleOfIntroMobile from '../../imgs/ExampleOfIntroMobile.jpg';

export default function Public(props) {
  const { match } = props;
  const { params } = match;
  const { uuid } = params;

  const loggedIn = useSelector(state => state.user.sessionToken);
  const place = useSelector(state => state.user.place);
  const overridePlace = useSelector(state => state.user.overridePlace);
  const allowIn = loggedIn && typeof place === 'number' && (place <= MINPLACE || overridePlace);

  const people = useSelector(state => state.people.records) || {};
  const peopleGetStatus = useSelector(state => state.people.get_status);

  const loggedOutInvestorIDs = useSelector(state => state.investors.loggedOutInvestorIDs) || [];
  const loggedOutInvestors = loggedOutInvestorIDs.map(lo => people[lo]);

  const userEmail = useSelector(state => state.user.email);
  const userUpdateStatus = useSelector(state => state.user.update_status);

  const publicProfileStatus = useSelector(state => state.founders.get_profile_status);
  const publicUserStatus = useSelector(state => state.founders.get_user_status);
  const getInvestorsStatus = useSelector(state => state.founders.get_investors_status) || '';
  const publicPostIntro = useSelector(state => state.founders.post_intro_status);

  const user = useSelector(state => state.user) || {};
  const pageUUID = uuid || user.uuid;
  const profile = useSelector(state => state.founders.publicFounders[pageUUID]) || {};
  const isMyPage = pageUUID === user.uuid;
  const boardPublic = profile.board_public;

  const public_records = useSelector(state => state.founders.publicInvestors) || {};
  let investorIDs = [];
  if (pageUUID) investorIDs = Object.keys(public_records) || [];

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
  }, [pageUUID, loggedOutInvestorIDs, public_records, dispatch]);

  const investorList = [];

  if (Array.isArray(investorIDs) && investorIDs.length) {
    investorIDs.forEach(i => {
      const person = people[i] ? { ...people[i] } : {};
      const investorStatus = public_records[i] || {};
      if (investorStatus.stage !== 'archived') {
        investorList.push({
          ...person,
          ...investorStatus, // merge in manual edits
          uuid: i,
          investorStatus,
        });
      }
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
      modalProps: { initialMode: 'create' },
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

  let userState;
  if (!pageUUID && investorList.length < 1 && loggedOutInvestorIDs.length < 1) {
    userState = 'new';
  } else if (!pageUUID && (investorList.length > 0 || loggedOutInvestorIDs.length > 0)) {
    userState = 'newWithInvestors';
  }
  const newUserStates = ['new', 'newWithInvestors'];

  return (
    <Row id="PageBoard" className="pageContainer public">
      {showConfirmHide && <GenericModal {...confirmDeleteProps} />}
      {!newUserStates.includes(userState) && isMyPage && allowIn && (
        <div className="d-flex w-100 align-items-center mb-3">
          <span className="ml-auto mr-2">
            <a
              href="/profile"
              className="text-secondary-light2"
            >
              {(!profile.name || !profile.primary_organization_name)
                ? 'Add Details To Your Public Profile' : 'Edit Profile'}
            </a>
          </span>
          <span>
            <a
              href="/board"
              className="text-secondary-light2 text-nowrap"
            >
              Manage
              <span className="d-none d-md-inline">&nbsp;My Board</span>
            </a>
          </span>
        </div>
      )}
      {!newUserStates.includes(userState) && publicProfileStatus === 'succeeded' && (
        <div>
          <div className="mb-3">
            <h1 className="text-center h2 h-md-1 mb-3">
              {
                `${
                  profile.name ? profile.name : '[Secret Founder]'
                }${
                  profile.primary_job_title ? `, ${profile.primary_job_title}` : ''
                } from 
                ${
                  profile.primary_organization_name ? profile.primary_organization_name : '[In Stealth Mode]'
                } is Building Their Network`
              }
            </h1>
            <h2 className="text-center h4 h-md-3">
              Which Investors Can You Intro?
            </h2>
          </div>
          {Object.values(profile).filter(v => v).length > 0 && (
            <div className="d-flex justify-content-center mb-4">
              <Button
                variant="outline-secondary"
                className="btnNoMax txs-3"
                type="button"
                onClick={onClickShowProfile}
                data-track="PublicShowProfile"
              >
                <span>
                  {
                    `Learn More About 
                    ${profile.name ? profile.name : 'This Founder'}
                    ${profile.name && profile.primary_organization_name ? 'at' : ''}
                    ${profile.primary_organization_name ? profile.primary_organization_name : ''}`
                  }
                </span>
              </Button>
            </div>
          )}
        </div>
      )}
      {statusBars.map(s => <DismissibleStatus {...s} />)}
      <div>
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
          {userState === 'new' && (
            <div>
              <div className="mt-3 mb-4">
                <h1 className="headline">Welcome to FundBoard!</h1>
                <div className="tagline">
                  <p>
                    <strong className="text-primary">
                      Search
                    </strong>
                    &nbsp;for investors that want to invest in your startup.
                  </p>
                  <p>
                    <strong className="text-primary">
                      Save
                    </strong>
                    &nbsp;them to your FundBoard.
                  </p>
                  <p>
                    <strong className="text-primary">
                      Share
                    </strong>
                    &nbsp;them to get warm introductions.
                  </p>
                </div>
              </div>
              <div className="d-flex justify-content-center mb-4">
                <Button
                  variant="secondary"
                  className="btnNoMax"
                  onClick={onGoToSearch}
                  data-track="PublicFindInvestors"
                >
                  Step 1: Find Investors
                </Button>
              </div>
              <img
                className="d-none d-md-inline responsiveImg mt-1 mb-4"
                src={ExampleOfIntro}
                alt="A screenshot of someone providing an introduction to an investor on your FundBoard"
              />
              <img
                className="d-md-none responsiveImg mb-1"
                src={ExampleOfIntroMobile}
                alt="A screenshot of someone providing an introduction to an investor on your FundBoard"
              />
              <p className="text-center txs-1">
                <i>This is just a screenshot. Find some investors to get intros for real.</i>
              </p>
            </div>
          )}
          {userState === 'newWithInvestors' && (
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
                  data-track="PublicGoToLogin"
                >
                  Make My FundBoard Shareable
                </Button>
              </div>
            </div>
          )}
        </div>
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
