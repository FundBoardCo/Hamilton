import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { capitalizeFirstLetter } from '../../utils';
import StageIcon from './StageIcon';

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
    matches = {},
    investorStatus = {},
  } = props;

  console.log(investorStatus)

  const primary_organization_logo = primary_organization.image_url || '';
  const primary_organization_name = primary_organization.name || '';

  let percentageMatch = matches.percentage_match || 0;
  percentageMatch = `${Math.floor(percentageMatch * 100)}%`;

  const investors = useSelector(state => state.board.ids) || [];
  const isOnBoard = investors.includes(uuid);

  const history = useHistory();

  const showPerson = () => {
    const root = isBoard ? 'board' : 'search';
    history.push(`/${root}/${uuid}`);
  };

  const location = useLocation();

  const path = capitalizeFirstLetter(location.pathname.substring(1).split('/')[0]);

  const investorStage = path === 'Board' ? investorStatus.stage || 'added' : isOnBoard && 'added';
  const { notes = [], next = {} } = investorStatus;

  const validationProps = {};

  if (status === 'ACTIVE') {
    validationProps.classes = 'text-secondary';
    validationProps.faIcon = 'star';
  }

  if (status === 'INACTIVE') {
    validationProps.classes = 'text-danger';
    validationProps.faIcon = 'ban';
  }

  return (
    <div className={`personWrapper ${path}`}>
      <button
        className="person"
        onClick={showPerson}
        type="button"
        data-track={`${path}Person`}
      >
        <div className="thumb" style={{ backgroundImage: `url(${image_url})` }} />
        <div className="content">
          <div>
            <h1>
              {validationProps.faIcon && (
              <FontAwesomeIcon icon={validationProps.faIcon} className={`mr-1 ${validationProps.classes}`} />
              )}
              {name || uuid}
            </h1>
          </div>
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
        </div>
        <div className="controls">
          <StageIcon stage={investorStage} showText />
          <div className="percentageMatch">
            {path !== 'Board' && `${percentageMatch}`}
          </div>
        </div>
      </button>
      {path === 'Board' && (
        <div className="notes text-primary">
          {`Notes(${notes.length})${notes.length > 0 ? `: ${notes[0]}` : ''}`}
        </div>
      )}
      {path === 'Board' && (
        <div className="next">
          <span className={next.waiting ? 'text-primary' : 'text-danger'}>
            {next.waiting ? 'Waiting' : 'Next'}
            :&nbsp;
          </span>
          <span className={next.waiting ? 'text-primary' : ''}>
            {next.text ? next.text : ''}
          </span>
          <span className="date">
            {next.date ? moment(next.date).format('LLL') : ''}
          </span>
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
  investorStatus: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number,
  ])),
};
