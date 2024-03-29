import React, { useState, useEffect } from 'react';
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
import * as types from '../../actions/types';
import NameTag from '../../components/people/PersonNameTag';
import RaiseBullet from '../../components/people/RaiseBullet';
import DismissibleStatus from '../../components/DismissibleStatus';
import { cb_founder_imagePrefix } from '../../constants';

const matchData = [
  {
    key: 'accepts_direct_outreach',
    faIcon: 'door-open',
    text: 'They are open to direct outreach.',
    bool: true,
  },
  {
    key: 'diverse_investors_list',
    faIcon: 'users',
    text: 'They are on the Founder For Change Diverse Investors list.',
    link: 'https://www.foundersforchange.org/diverse-investors-list',
    bool: true,
  },
  {
    key: 'techcrunch_list',
    faIcon: 'list-alt',
    text: 'They are on The TechCrunch List.',
    link: 'https://techcrunch.com/the-techcrunch-list',
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
    investments_led = 0,
    cur_investments_led = 0,
    num_partner_investments = 0,
    investor_type = [],
    // investments = [],
    is_lead_investor = false,
    // is_open = false,
    // is_impact = false,
    // isBoard = false,
  } = data;

  const twitterName = getSafeVar(() => twitter.substr(twitter.lastIndexOf('/') + 1), '');

  const searchState = useSelector((state => state.search));
  const searchedLocationPairs = useSelector(state => state.search.searchedLocationPairs);
  const investorTypes = investor_type.includes('investment_partner') ? ['a VC'] : [];
  if (investor_type.includes('angel')) investorTypes.push('an angel');
  if (!investorTypes[0]) investorTypes[0] = 'not listed as an investor';

  // recalculate this because it may come from the board page and not have match data
  const calcedMatches = calcMatch({
    ...searchState,
    investor: { ...data },
  });

  const { matches } = calcedMatches;

  const percentageMatch = `${matches.percentage_match || 0}%`;

  const startupsCB = useSelector(state => state.startups.startupsCB);
  const startupsCBStatus = useSelector(state => state.startups.get_startupsCB_status);

  const founders = [];
  Object.values(startupsCB)
    .filter(fs => startups.includes(fs.uuid))
    .forEach(investedStartup => {
      if (Array.isArray(investedStartup.founders)) {
        investedStartup.founders.forEach(f => {
          founders.push({
            name: f.name,
            permalink: f.permalink,
            image_url: f.image_url || `${cb_founder_imagePrefix}${f.image_id}`,
            org_name: investedStartup.name,
            org_permalink: investedStartup.permalink,
            logo_url: investedStartup.image_url,
          });
        });
      }
    });

  const [invalidOpen, setInvalidOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: types.STARTUPSCB_GET_REQUESTED,
      uuids: startups,
    });
  }, [startups, dispatch]);

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

  const matchedLocations = invested_locations
    .filter(l => searchedLocationPairs.includes(l.toLowerCase()));
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
      <section className="matches mb-4">
        <h2 className="sectionHead">
          {path === 'Board' ? 'Investor Facts' : `${percentageMatch} Match`}
        </h2>
        {path !== 'Board' && !!matches && Object.keys(matches).length > 0 ? (
          <ul>
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
            <RaiseBullet
              faIcon="flag"
              bool={investments_led > 0}
              text={`They have led ${cur_investments_led} investments at their current org. They have led ${investments_led} investments overall, and been a partner in ${num_partner_investments} investments.`}
            />
            <RaiseBullet
              faIcon="money-check"
              bool={!!investorTypes.length}
              text={`They are ${investorTypes[0] || 'unknown'}${investorTypes.length > 1 ? ` and ${investorTypes[1]}` : ''}.`}
            />
            {matchData.map(d => {
              if (data[d.key]) {
                return <RaiseBullet {...d} />;
              }
              return null;
            })}
          </ul>
        ) : (
          <ul>
            <RaiseBullet
              faIcon="flag"
              bool={investments_led > 0 || is_lead_investor}
              text={`They have led ${cur_investments_led} investments at their current org. They have led ${investments_led} investments overall, and been a partner in ${num_partner_investments} investments.`}
            />
            <RaiseBullet
              faIcon="money-check"
              bool={!!investorTypes.length}
              text={`They are ${investorTypes[0] || 'unknown'}${investorTypes.length > 1 ? ` and ${investorTypes[1]}` : ''}.`}
            />
            {matchData.map(d => {
              if (data[d.key]) {
                return <RaiseBullet {...d} />;
              }
              return null;
            })}
          </ul>
        )}
      </section>
      {Array.isArray(startups) && startups.length > 0 && (
        <DismissibleStatus
          status={startupsCBStatus}
          showSuccess={false}
          statusPrefix="Loading founders data"
          dissmissAction={types.STARTUPSCB_GET_DISMISSED}
        />
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
