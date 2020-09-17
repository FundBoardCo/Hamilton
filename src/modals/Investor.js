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
import { calcMatch, capitalizeFirstLetter, getSafeVar, statusIsError } from '../utils';
import * as types from '../actions/types';
import DismissibleStatus from '../components/DismissibleStatus';
import ErrorBoundary from '../components/ErrorBoundary';

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
    bool: true,
  },
  {
    key: 'isOpen',
    faIcon: 'door-open',
    text: 'They are open to direct outreach.',
    bool: true,
  },
  {
    key: 'isImpact',
    faIcon: 'balance-scale',
    text: 'Their organization is an impact fund.',
    bool: true,
  },
];

function MatchBullet(params) {
  const { faIcon, text, bool } = params;
  return (
    <li>
      <div className={`iconDisc ${bool ? 'bg-primary' : 'bg-warning-light3'}`}>
        <FontAwesomeIcon icon={faIcon} />
        {!bool && <FontAwesomeIcon icon="ban" className="iconDiscOverlay text-warning" />}
      </div>
      <span className={bool ? 'text-primary' : 'text-warning'}>{text}</span>
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

  const people = useSelector(state => state.people);
  const data = people[uuid] || {};
  const {
    status,
    name,
    image_url = '',
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
    validation,
  } = data;

  console.log(data)

  const primary_organization_logo = primary_organization.image_url || '';
  const primary_organization_name = primary_organization.name || '';
  const primary_organization_homepage = primary_organization.homepage || '';
  const twitterName = getSafeVar(() => twitter.substr(twitter.lastIndexOf('/') + 1), '');

  const searchKeywords = useSelector(state => state.search.keywords);
  const searchRaise = useSelector(state => state.search.raise);
  const searchLocation = useSelector(state => state.search.location);
  const extraLocations = useSelector(state => state.search.extraLocations);

  const searchData = useSelector(state => state.search.results[uuid] || {});
  const calcedMatch = calcMatch({
    ...data,
    keywords: searchKeywords,
    raise: searchRaise,
    location: searchLocation,
    extraLocations,
  });

  const { percentageMatch, matches } = calcedMatch;

  const parsedInvestors = {};
  investments.forEach(i => {
    if (Array.isArray(i.founders) && i.founders[0]) {
      const founder = i.founders[0];
      parsedInvestors[founder.permalink] = {
        ...founder,
        date: i.date,
        org_name: i.startup_name,
        org_permalink: i.startup_permalink,
        logo_url: i.image_url,
        amount: i.amount,
      };
    }
  });

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
      id: uuid,
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
    text: isOnBoard ? 'Remove from my Fundboard' : 'Save to my FundBoard',
    bgCol: isOnBoard ? 'bg-warning' : 'bg-secondary',
    track: isOnBoard ? 'remove' : 'add',
    faIcon: isOnBoard ? 'minus' : 'plus',
  };

  let locationText = location_state ? `${location_city}, ${location_state}` : location_state;
  locationText = locationText ? `They are located in ${locationText}.` : 'No location available.';
  locationText = `${locationText} Investors are more likely to invest locally.`;

  const validationProps = {
    text: 'This investor has not been validated by FundBoard yet.',
    classes: 'text-warning',
  };

  if (validation === 'verified') {
    validationProps.text = 'This investor has been validated by FundBoard.';
    validationProps.classes = 'text-primary';
  }

  if (validation === 'invalid') {
    validationProps.text = 'This investor is no longer investing, or their data is otherwise invalid.';
    validationProps.classes = 'text-danger';
  }

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
        <section className="investorHeader mb-4">
          <div className="thumbCol">
            <div className="thumb">
              <Suspense fallback={<Spinner animation="border" variant="info" role="status" size="sm" />}>
                <ErrorBoundary>
                  <ImgComp imgSrc={image_url} alt={name} />
                </ErrorBoundary>
              </Suspense>
            </div>
          </div>
          <div className="d-flex flex-column">
            <h1>{name}</h1>
            <a
              className="orgDetails"
              href={primary_organization_homepage}
              target="_blank"
              rel="noopener noreferrer"
              data-track={`${path}InvestorHomepage`}
            >
              {primary_organization_logo && (
                <div className="orgLogoWrapper">
                  <Suspense fallback={<Spinner animation="border" variant="info" role="status" size="sm" />}>
                    <ErrorBoundary>
                      <ImgComp imgSrc={primary_organization_logo} alt={primary_organization_name} />
                    </ErrorBoundary>
                  </Suspense>
                </div>
              )}
              {(primary_job_title || primary_organization_name) && (
                <div>
                  {`${primary_job_title}${primary_job_title && ','}`}
                  {`${primary_job_title ? '\xa0' : ''}`}
                  {primary_organization_name}
                </div>
              )}
            </a>
          </div>
        </section>
        <DismissibleStatus
          status={status}
          showSuccess={false}
          dissmissAction={types.PEOPLE_GET_DISMISS}
          dismissParams={{ ids: [uuid] }}
        />
        <section className="mb-2">
          <span className={validationProps.classes}>{validationProps.text}</span>
        </section>
        <section className="mb-4">
          {description && (
            <div className="description mb-3">
              {description}
            </div>
          )}
          {permalink && (
            <div className="crunchBaseAttribution mb-3">
              <a
                href={`https://www.crunchbase.com/person/${permalink}`}
                target="_blank"
                rel="noopener noreferrer"
                data-track={`${path}InvestorCrunchBase`}
              >
                Sourced from CrunchBase
              </a>
            </div>
          )}
          {linkedin && (
            <div className="h4 text-linkedin d-flex">
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
        </section>
        <section className="matches mb-4">
          <h2>{searchLocation && `${percentageMatch}% Match`}</h2>
          <ul>
            {matchData.map(d => {
              if (searchData[d.key]) {
                return <MatchBullet {...d} />;
              }
              return null;
            })}
            <MatchBullet
              faIcon="key"
              bool={matches.keywords.length > 0 || !searchLocation}
              text={`Their matching interests: ${matches.keywords.length ? matches.keywords.join(', ') : 'none'}.`}
            />
            <MatchBullet
              faIcon="rocket"
              bool={matches.raise || !searchLocation}
              text={`They invest in rounds of ${usdFormatter.format(raise_min)} or more.`}
            />
            <MatchBullet
              faIcon="map-marker-alt"
              bool={matches.location || !searchLocation}
              text={locationText}
            />
          </ul>
        </section>
        {Array.isArray(investments) && investments.length > 0 && (
          <section className="funded mb-4">
            <h2>Founders they&apos;ve funded</h2>
            <div className="founders">
              {Object.keys(parsedInvestors).map(k => (
                <PersonStamp key={k} {...parsedInvestors[k]} />
              ))}
            </div>
          </section>
        )}
        {twitterName && (
          <section className="twitterFeed">
            <div className="h4 text-twitter d-flex mb-2">
              <FontAwesomeIcon icon={['fab', 'twitter-square']} />
              &nbsp;
              <a
                href={`http://twitter.com/${twitterName}`}
                className="text-twitter"
                target="_blank"
                rel="noopener noreferrer"
                data-track={`${path}InvestorTwitter`}
              >
                Twitter Feed
              </a>
            </div>
            <Timeline
              dataSource={{
                sourceType: 'profile',
                screenName: twitterName,
              }}
              options={{
                height: '400',
                tweetLimit: '3',
                chrome: 'noheader nofooter noborders transparent noscrollbar',
              }}
            />
          </section>
        )}
        <section className="invalidWrapper">
          {!data.invalid && (
            <div className="openLinkWrapper">
              <FontAwesomeIcon icon="comment" />
              &nbsp;
              <Button
                variant="link"
                onClick={() => setInvalidOpen(!invalidOpen)}
                data-track={`${path}InvestorToggleInvalid`}
              >
                If you think any of the data above is outdated, click here to let us know.
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
                    The name, title, or their organization is outdated.
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
            <div className="p-3 text-center h4 text-primary">
              Thank you. Your report has been received.
            </div>
          )}
        </section>
      </Modal.Body>
      <Modal.Footer>
        <button
          className={`addBtn ${addBtnProps.bgCol}`}
          type="button"
          onClick={toggleInvestor}
          data-track={`${path}InvestorAdd-${addBtnProps.track}`}
        >
          <FontAwesomeIcon icon={addBtnProps.faIcon} className="mr-2" />
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
