import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Timeline } from 'react-twitter-widgets';
import moment from 'moment';
import PersonStamp from '../../components/people/PersonStamp';
import {
  convertInvestedLocations,
  getSafeVar,
  statusIsError,
  convertKeyTags,
  calcMatch,
} from '../../utils';
// import * as types from '../../actions/types';
import NameTag from '../../components/people/PersonNameTag';
import RaiseBullet from '../../components/people/RaiseBullet';
import { cb_founder_imagePrefix } from '../../constants';

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

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function InvestorData(props) {
  const { uuid, data = {}, path } = props;

  const {
    name,
    description,
    permalink,
    linkedin,
    twitter,
    raise_min,
    // raise_max,
    raise_median,
    status,
    location_city,
    location_state,
    startups = [],
    invested_locations = [],
    // investments = [],
    // is_lead_investor = false,
    // is_open = false,
    // is_impact = false,
    // isBoard = false,
  } = data;

  const twitterName = getSafeVar(() => twitter.substr(twitter.lastIndexOf('/') + 1), '');

  const searchKeywords = useSelector(state => state.search.keywords);
  const searchRaise = useSelector(state => state.search.raise);
  const searchedCityState = useSelector(state => state.search.searchedCityState);
  const searchedLocationPairs = useSelector(state => state.search.searchedLocationPairs);

  const searchData = useSelector(state => state.search.results[uuid] || {});

  const calcedMatches = calcMatch({
    investor: { ...data },
    keywords: searchKeywords,
    raise: searchRaise,
    searchedCityState,
    searchedLocationPairs,
  });

  const { matches } = calcedMatches;

  const percentageMatch = `${matches.percentage_match || 0}%`;

  const founders = [];

  startups.forEach(s => {
    if (Array.isArray(s.founder_identifiers)) {
      s.founder_identifiers.forEach(f => {
        // don't add the same founder twice
        const allPermalinks = founders.map(fp => fp.permalink);
        if (!allPermalinks.includes(f.permalink)) {
          founders.push({
            name: f.value,
            permalink: f.permalink,
            image_url: `${cb_founder_imagePrefix}${f.image_id}`,
            org_name: s.name,
            org_permalink: s.permalink,
            logo_url: s.image_url,
          });
        }
      });
    }
  });

  const [invalidOpen, setInvalidOpen] = useState(false);

  const dispatch = useDispatch();

  const reportInvalid = reason => dispatch({
    type: 'PERSON_PUT_INVALID_REQUESTED',
    params: {
      uuid,
      name,
      permalink,
      date: moment().format(),
      reason,
    },
  });

  const clearInvalid = () => dispatch({
    type: 'PERSON_CLEAR_INVALID',
    params: {
      uuid,
    },
  });

  let locationText = convertInvestedLocations([`${location_city}_${location_state}`]);
  locationText = locationText ? `They are located in ${locationText}` : '';

  const matchedLocations = invested_locations.filter(l => searchedLocationPairs.includes(l));
  const investedInText = convertInvestedLocations(matchedLocations);

  if (investedInText) {
    locationText = locationText
      ? `${locationText}, and have invested in ${investedInText}.`
      : `They have invested in ${investedInText}.`;
  }

  locationText = locationText || 'No locations for this investor were found.';

  const validationProps = {
    text: 'This investor has not been validated by FundBoard yet.',
    classes: 'text-warning',
  };

  if (status === 'ACTIVE') {
    validationProps.text = 'This investor has been validated by FundBoard.';
    validationProps.classes = 'text-secondary';
    validationProps.faIcon = 'star';
  }

  if (status === 'INACTIVE') {
    validationProps.text = 'This investor is no longer investing, or their data is otherwise invalid.';
    validationProps.classes = 'text-danger';
    validationProps.faIcon = 'ban';
  }

  return (
    <div>
      <NameTag data={data} path={path} />
      <section className="mb-4">
        {description && (
          <div
            className="description mb-3"
            dangerouslySetInnerHTML={{ __html: convertKeyTags(description) }}
          />
        )}
      </section>
      {path !== 'Board' && !!matches && Object.keys(matches).length > 0 && (
        <section className="matches mb-4">
          <h2 className="sectionHead">{`${percentageMatch} Match`}</h2>
          <ul>
            {matchData.map(d => {
              if (searchData[d.key]) {
                return <RaiseBullet {...d} />;
              }
              return null;
            })}
            <RaiseBullet
              faIcon="key"
              bool={(Array.isArray(matches.keywords) && matches.keywords.length > 0)}
              text={`Their matching interests: ${matches.keywords.length ? matches.keywords.join(', ') : 'none'}.`}
            />
            <RaiseBullet
              faIcon="rocket"
              bool={matches.raise}
              text={`They invest in rounds of ${usdFormatter.format(raise_min)} or more. 
              The median round they participate in is ${usdFormatter.format(raise_median)}`}
            />
            <RaiseBullet
              faIcon="map-marker-alt"
              bool={matches.location}
              text={locationText}
            />
          </ul>
        </section>
      )}
      {Array.isArray(founders) && founders.length > 0 && (
        <section className="funded mb-4">
          <h3 className="sectionHead">Founders They&apos;ve Funded</h3>
          <div className="founders">
            {founders.map(k => (
              <PersonStamp key={k.permalink} {...k} />
            ))}
          </div>
        </section>
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
        <div className="h3 text-linkedin d-flex mb-3">
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
      {twitterName && (
        <section className="twitterFeed">
          <div className="h3 text-twitter d-flex mb-3 sectionHead">
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
              <div className="invalidError d-flex flex-column align-items-center">
                <span className="mb-2">
                  {`Error: ${data.invalid_status}`}
                </span>
                <Button
                  variant="danger-light"
                  className="btnNoMax"
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
    </div>
  );
}

InvestorData.defaultProps = {
  uuid: '',
  data: {},
  path: '',
};

InvestorData.propTypes = {
  uuid: PropTypes.string,
  data: PropTypes.shape({
    params: PropTypes.objectOf(PropTypes
      .oneOfType([PropTypes.bool, PropTypes.string, PropTypes.objectOf(PropTypes.string)])),
  }),
  path: PropTypes.string,
};
