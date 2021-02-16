import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { capitalizeFirstLetter } from '../../utils';
import StageIcon from './StageIcon';
import RaiseBullet from './RaiseBullet';
import { cb_logo_imagePrefix } from '../../constants';

function randomKey() {
  return String(Math.floor(Math.random() * 100000000));
}

function Matches(props) {
  const { keywords, raise, location } = props;
  return (
    <ul className="matches">
      <RaiseBullet
        faIcon="key"
        bool={Array.isArray(keywords) && keywords.length > 0}
        text=""
      />
      <RaiseBullet
        faIcon="rocket"
        bool={raise}
        text=""
      />
      <RaiseBullet
        faIcon="map-marker-alt"
        bool={location}
        text=""
      />
    </ul>
  );
}

export default function Person(props) {
  const {
    uuid,
    name,
    image_url = '',
    primary_job_title = '',
    primary_organization = {},
    // isLead = false,
    // isOpen = false,
    // isImpact = false,
    isBoard = false,
    status,
    sortedBy,
    matches = {},
    investorStatus = {},
  } = props;

  let {
    primary_organization_name,
    primary_organization_logo,
  } = props;

  // Sometimes the logo is an image_id instead of an URL
  const imageIDURL = primary_organization.image_id
    ? `${cb_logo_imagePrefix}${primary_organization.image_id}` : '';

  primary_organization_logo = primary_organization_logo
    || primary_organization.image_url
    || imageIDURL
    || '';
  primary_organization_name = primary_organization_name
    || primary_organization.name
    || primary_organization.value
    || '';

  let percentageMatch = matches.percentage_match || 0;
  percentageMatch = `${percentageMatch}%`;

  const ownInvestors = useSelector(state => state.investors.ownInvestors) || {};
  const investorIds = Object.keys(ownInvestors);
  const isOnBoard = investorIds.includes(uuid);

  const location = useLocation();
  const path = location.pathname.substring(1).split('/')[0];
  const capPath = capitalizeFirstLetter(path);

  const history = useHistory();

  const clickPerson = () => {
    history.push(`/${path}/${uuid}`);
  };

  const investorStage = investorStatus.stage || (isOnBoard && 'added');
  let { notes } = investorStatus;
  let next = {};
  if (notes && Object.values(notes).length) {
    next = Object.values(notes).filter(v => v.next);
    notes = Object.values(notes).filter(v => !v.next);
  } else {
    // Sometimes notes gets saved as an object somehow?
    notes = [];
  }

  const validationProps = {};

  if (status === 'ACTIVE') {
    validationProps.classes = 'text-secondary';
    validationProps.faIcon = 'star';
  }

  if (status === 'INACTIVE') {
    validationProps.classes = 'text-danger';
    validationProps.faIcon = 'ban';
  }

  if (sortedBy === 'next' && !next.length) return null;

  return (
    <div className={`personWrapper ${isBoard ? 'Board' : ''}`}>
      <button
        className="person"
        onClick={clickPerson}
        type="button"
        data-track={`${capPath}Person`}
      >
        <div className="thumb" style={{ backgroundImage: `url(${image_url})` }} />
        <div className="content">
          {sortedBy !== 'next' && (
            <div>
              <h1>
                {validationProps.faIcon && (
                <FontAwesomeIcon icon={validationProps.faIcon} className={`mr-1 ${validationProps.classes}`} />
                )}
                {name || uuid}
              </h1>
            </div>
          )}
          {sortedBy !== 'next' && (
            <div className="d-flex details">
              {primary_organization_logo && (
                <div className="orgLogoWrapper" style={{ backgroundImage: `url(${primary_organization_logo})` }} />
              )}
              <div className="orgText">
                {primary_job_title && (
                  <div>
                    {`${primary_job_title}${primary_job_title && ','}`}
                    {`${primary_job_title ? '\xa0' : ''}`}
                    {primary_organization_name}
                  </div>
                )}
              </div>
            </div>
          )}
          {sortedBy === 'next' && next.length && next.map(n => (
            <div className="next sortedByNext" key={randomKey()}>
              <span className="text">
                <span className="text-danger">
                  To Do Next:&nbsp;
                </span>
                {n.text ? n.text : ''}
              </span>
              <span className="date">
                {n.date ? n.date : ''}
              </span>
            </div>
          ))}
        </div>
        <div className="controls">
          {path === 'search' ? (
            <Matches {...matches} />
          ) : (
            <StageIcon stage={investorStage} withText />
          )}
          <div className="percentageMatch">
            {!isBoard && `${percentageMatch}`}
          </div>
        </div>
      </button>
      {isBoard && sortedBy !== 'next' && (
        <div className="notesWrapper">
          <div>
            <div className="notes text-primary">
              {`Notes(${notes.length})${notes.length > 0 ? `: ${notes[0].text}` : ''}`}
            </div>
            {next.length && next.map(n => (
              <div className="next" key={randomKey()}>
                <span className="text">
                  <span className={n.waiting ? 'text-primary' : 'text-danger'}>
                    {n.waiting ? 'Waiting for' : 'To Do Next'}
                    :&nbsp;
                  </span>
                  <span className={n.waiting ? 'text-primary' : ''}>
                    {n.text ? n.text : ''}
                  </span>
                </span>
                <span className="date">
                  {n.date ? n.date : ''}
                </span>
              </div>
            ))}
          </div>
          <div className="published">
            {investorStatus.published ? (
              <span>
                <FontAwesomeIcon icon="eye" className="mr-1" />
                <span>Public</span>
              </span>
            ) : (
              <span>
                <FontAwesomeIcon icon="eye-slash" className="mr-1" />
                <span>Private</span>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

Person.defaultProps = {
  uuid: 'not found',
  name: '',
  image_url: '',
  primary_job_title: '',
  primary_organization: {
    id: '',
    name: '',
    image_url: '',
    permalink: '',
    entity_def_id: '',
    homepage: '',
    linkedin: '',
    twitter: '',
  },
  primary_organization_name: '',
  primary_organization_logo: '',
  matches: {
    keywords: ['one', 'two'],
    raise: false,
    location: false,
    name: false,
    org: false,
  },
  // isLead: false,
  // isOpen: false,
  // isImpact: false,
  isBoard: false,
  status: '',
  sortedBy: '',
  investorStatus: {},
};

Person.propTypes = {
  uuid: PropTypes.string,
  name: PropTypes.string,
  image_url: PropTypes.string,
  primary_job_title: PropTypes.string,
  primary_organization: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number,
  ])),
  primary_organization_name: PropTypes.string,
  primary_organization_logo: PropTypes.string,
  matches: PropTypes.shape({
    keywords: PropTypes.arrayOf(PropTypes.string),
    raise: PropTypes.bool,
    location: PropTypes.bool,
    name: PropTypes.bool,
    org: PropTypes.bool,
  }),
  // isLead: PropTypes.bool,
  // isOpen: PropTypes.bool,
  // isImpact: PropTypes.bool,
  isBoard: PropTypes.bool,
  status: PropTypes.string,
  sortedBy: PropTypes.string,
  investorStatus: PropTypes.shape({
    id: PropTypes.string,
    notes: PropTypes
      .objectOf(PropTypes
        .objectOf(PropTypes
          .oneOfType([PropTypes.string, PropTypes.bool]))),
    intro: PropTypes.objectOf(PropTypes.string),
  }),
};
