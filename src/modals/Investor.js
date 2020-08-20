import React, { Suspense, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import { useImage } from 'react-image';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Timeline } from 'react-twitter-widgets';
import GreySquare from '../imgs/greySquare.jpg';
import PersonStamp from '../components/people/PersonStamp';
import { capitalizeFirstLetter, getSafeVar, statusIsError } from '../utils';
import * as types from '../actions/types';
import DismissibleStatus from '../components/DismissibleStatus';

function ImgComp(params) {
  const { imgSrc = '', alt = '' } = params;
  const { src } = useImage({
    srcList: imgSrc || GreySquare,
  });
  return <img src={src} alt={alt || ''} className="responsiveImg" />;
}

const matchData = [
  {
    key: 'isLead',
    faIcon: 'flag',
    text: 'They lead funding rounds.',
  },
  {
    key: 'isOpen',
    faIcon: 'door-open',
    text: 'They are open to direct outreach.',
  },
  {
    key: 'isImpact',
    faIcon: 'balance-scale',
    text: 'Their organization is an impact fund.',
  },
];

function MatchBullet(params) {
  const { faIcon, text } = params;
  return (
    <li>
      <div className="iconDisc bg-primary">
        <FontAwesomeIcon icon={faIcon} />
      </div>
      <span>{text}</span>
    </li>
  );
}

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Investor(props) {
  const { match } = props;
  const { params } = match;
  const { uuid } = params;
  console.log(props)

  const people = useSelector(state => state.people);
  console.log(people)
  const data = people[uuid] || {};
  console.log(data)
  const {
    status,
    name,
    image_id = '',
    primary_job_title = '',
    primary_organization = {},
    description,
    permalink,
    linkedin,
    twitter,
    raise_min,
    raise_max,
    location_city,
    location_state,
    investments = [],
    is_lead_investor = false,
    is_open = false,
    is_impact = false,
    isBoard = false,
    invalid,
    invalid_status,
  } = data;

  const primary_organization_logo = primary_organization.image_url || '';
  const primary_organization_name = primary_organization.value || '';
  const twitterName = getSafeVar(() => twitter.substr(twitter.lastIndexOf('/') + 1), '');

  const searchData = useSelector(state => state.search.results[uuid] || {});

  const { matches = {} } = searchData;
  let percentageMatch = (Array.isArray(matches.keywords) && matches.keywords.length) || 0;
  if (matches.raise) percentageMatch += 1;
  if (matches.location) percentageMatch += 1;
  percentageMatch = Math.floor((percentageMatch / 7) * 100);

  const investors = useSelector(state => state.board.ids) || [];

  const isOnBoard = investors.includes(uuid);

  const [invalidOpen, setInvalidOpen] = useState(false);

  const location = useLocation();

  const path = capitalizeFirstLetter(location.pathname.substring(1));

  const history = useHistory();

  const closeModal = () => {
    history.goBack();
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: types.PEOPLE_GET_REQUEST,
      ids: [uuid],
    });
  }, [dispatch, uuid]);

  useEffect(() => {
    dispatch({
      type: types.PEOPLE_GET_INVESTMENTS_REQUEST,
      id: uuid,
    });
  }, [dispatch, uuid]);

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

  const reportInvalid = reason => dispatch({
    type: 'PERSON_PUT_INVALID_REQUESTED',
    params: {
      uuid,
      reason,
    },
  });

  const clearInvalid = () => dispatch({
    type: 'PERSON_CLEAR_INVALID',
    params: {
      uuid,
    },
  });

  const addBtnProps = {
    text: isOnBoard ? 'Remove from my FundBoard' : 'Add to my FundBoard',
    bgCol: isOnBoard ? 'bg-warning' : 'bg-secondary',
    track: isOnBoard ? 'remove' : 'add',
  };

  return (
    <Modal
      size="lg"
      aria-labelledby="Modal-Title"
      centered
      show
      scrollable
      onHide={closeModal}
      className="modal-investor"
    >
      <Modal.Header closeButton>
        <Modal.Title className="sr-only">
          {name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="investorHeader mb-2">
          <div className="thumbCol">
            <div className="thumb">
              <Suspense fallback={<Spinner animation="border" variant="info" role="status" size="sm" />}>
                <ImgComp imgSrc={image_id} alt={name} />
              </Suspense>
            </div>
          </div>
          <div className="d-flex flex-column">
            <h1>{name}</h1>
            <div className="orgDetails">
              <div className="orgLogoWrapper">
                <Suspense fallback={<Spinner animation="border" variant="info" role="status" size="sm" />}>
                  <ImgComp imgSrc={primary_organization_logo} alt={primary_organization_name} />
                </Suspense>
              </div>
              <div>
                {`${primary_job_title}${primary_job_title && ','}`}
                {`${primary_job_title ? '\xa0' : ''}`}
                {primary_organization_name}
              </div>
            </div>
          </div>
        </div>
        <DismissibleStatus
          status={status}
          showSuccess={false}
          dissmissAction={types.PEOPLE_GET_DISMISS}
          dismissParams={{ ids: [uuid] }}
        />
        {permalink && (
          <div className="crunchBaseAttribution mb-2">
            Sourced from CrunchBase.&nbsp;
            <a
              href={`https://www.crunchbase.com/person/${permalink}`}
              target="_blank"
              rel="noopener noreferrer"
              data-track={`${path}InvestorCrunchBase`}
            >
              Click to view profile.
            </a>
          </div>
        )}
        {description && (
          <div className="description mb-3">
            {description}
          </div>
        )}
        {linkedin && (
          <div className="mb-4 h3 text-linkedin d-flex">
            <FontAwesomeIcon icon={['fab', 'linkedin']} />
            &nbsp;
            <a
              href={linkedin}
              className="text-linkedin"
              target="_blank"
              rel="noopener noreferrer"
              data-track={`${path}InvestorLinkedIn`}
            >
              LinkedIn Profile
            </a>
          </div>
        )}
        <div className="matches">
          <h2>{`${percentageMatch}% Match`}</h2>
          <ul>
            {matchData.map(d => {
              if (searchData[d.key]) {
                return <MatchBullet {...d} />;
              }
              return null;
            })}
            {Array.isArray(matches.keywords) && matches.keywords.length && (
              <MatchBullet
                faIcon="key"
                text={`Their matching interests: ${matches.keywords.join(', ')}.`}
              />
            )}
            {matches.raise && (
              <MatchBullet
                faIcon="rocket"
                text={`They invest between ${usdFormatter.format(raise_min)} and ${usdFormatter.format(raise_max)}.`}
              />
            )}
            {matches.location && (
              <MatchBullet
                faIcon="map-marker-alt"
                text={`They are located in ${location_city}, ${location_state}`}
              />
            )}
          </ul>
        </div>
        {Array.isArray(investments) && investments.length > 0 && (
          <div className="funded">
            <h2>Founders they&apos;ve funded</h2>
            <div className="founders">
              {Array.isArray(investments) && investments.map(i => {
                const pProps = {
                  org_name: i.name,
                  logo_url: i.logo_url,
                  ...i.founders[0],
                };
                return <PersonStamp key={i.id} {...pProps} />;
              })}
            </div>
          </div>
        )}
        <div className="twitterFeed">
          {twitterName && (
            <Timeline
              dataSource={{
                sourceType: 'profile',
                screenName: twitterName,
              }}
              options={{
                height: '400',
                tweetLimit: '3',
                chrome: 'noheader nofooter transparent',
              }}
            />
          )}
        </div>
        <div className="invalidWrapper">
          {!data.invalid && (
            <div className="openLinkWrapper">
              <FontAwesomeIcon icon="exclamation-triangle" />
              &nbsp;
              <Button
                variant="link"
                onClick={() => setInvalidOpen(!invalidOpen)}
                data-track={`${path}InvestorToggleInvalid`}
              >
                I think this profile is out of date.
              </Button>
            </div>
          )}
          {invalidOpen && !data.invalid && (
            <div className="invalidBtns">
              {!data.invalid_status && (
                <div>
                  <Button
                    variant="link"
                    onClick={() => reportInvalid('NameTitleOrg')}
                    data-track={`${path}InvestorInvalid-NameTitleOrg`}
                  >
                    The name, title, or their organization is outdated
                  </Button>
                  <Button
                    variant="link"
                    onClick={() => reportInvalid('Criteria')}
                    data-track={`${path}InvestorInvalid-Criteria`}
                  >
                    They shouldn&apos;t be in my search results.
                  </Button>
                  <Button
                    variant="link"
                    onClick={() => reportInvalid('Other')}
                    data-track={`${path}InvestorInvalid-Other`}
                  >
                    Something else about their information is out of date.
                  </Button>
                </div>
              )}
              {data.invalid_status === 'pending' && (
                <Spinner animation="border" variant="info" role="status" size="sm" />
              )}
              {data.invalid_status === 'succeeded' && (
                <div className="p-3 text-center">
                  Thank you. Your report has been recieved.
                </div>
              )}
              {statusIsError(data.invalid_status) && (
                <div className="invalidError">
                  <span>
                    {`Error: ${data.invalid_status}`}
                  </span>
                  <Button
                    variant="danger-light"
                    onClick={clearInvalid}
                  >
                    Clear error and try again
                  </Button>
                </div>
              )}
            </div>
          )}
          {data.invalid && (
            <div className="p-3 text-center h4 text-info">
              Thank you. Your report has been received.
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          className={`addBtn ${addBtnProps.bgCol}`}
          type="button"
          onClick={toggleInvestor}
          data-track={`${path}InvestorAdd-${addBtnProps.track}`}
        >
          {addBtnProps.text}
        </button>
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
