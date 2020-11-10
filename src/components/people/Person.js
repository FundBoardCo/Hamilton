import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { capitalizeFirstLetter } from '../../utils';
import StageIcon from './StageIcon';
import * as types from '../../actions/types';

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
    isPublic = false,
    status,
    sortedBy,
    matches = {},
    investorStatus = {},
  } = props;

  const { intro_name, intro_date } = investorStatus;

  const primary_organization_logo = primary_organization.image_url || '';
  const primary_organization_name = primary_organization.name || '';

  let percentageMatch = matches.percentage_match || 0;
  percentageMatch = `${Math.floor(percentageMatch * 100)}%`;

  const investors = useSelector(state => state.board.ids) || [];
  const isOnBoard = investors.includes(uuid);

  const location = useLocation();
  const path = location.pathname.substring(1).split('/')[0];
  const capPath = capitalizeFirstLetter(path);

  const history = useHistory();
  const dispatch = useDispatch();

  const clickPerson = () => {
    if (!isPublic) {
      history.push(`/${path}/${uuid}`);
    } else {
      dispatch({
        type: types.MODAL_SET_OPEN,
        modal: 'makeIntro',
        modalProps: { ...investorStatus },
      });
    }
  };

  const investorStage = isBoard ? investorStatus.stage || 'added' : isOnBoard && 'added';
  let { notes } = investorStatus;
  let next = {};
  if (notes && Object.values(notes).length) {
    [next = {}] = Object.values(notes).filter(v => v.next);
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

  if (sortedBy === 'next' && !next.text) return null;

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
          {sortedBy === 'next' && next.text && !isPublic && (
            <div className="next sortedByNext">
              <span className="text">
                <span className="text-danger">
                  Next:&nbsp;
                </span>
                {next.text ? next.text : ''}
              </span>
              <span className="date">
                {next.date ? moment(next.date).format('LLL') : ''}
              </span>
            </div>
          )}
        </div>
        { isPublic ? (
          <div>
            {['none', 'added'].includes(investorStage) ? (
              <span className="btn btn-link">
                I can introduce this investor.
              </span>
            ) : (
              <span>
                {`Introduced${intro_name ? ` by ${intro_name}` : ''}${intro_date ? `on ${intro_date}` : ''}`}
              </span>
            )}
          </div>
        ) : (
          <div className="controls">
            <StageIcon stage={investorStage} withText />
            <div className="percentageMatch">
              {!isBoard && `${percentageMatch}`}
            </div>
          </div>
        )}
      </button>
      {isBoard && sortedBy !== 'next' && !isPublic && (
        <div className="notes text-primary">
          {`Notes(${notes.length})${notes.length > 0 ? `: ${notes[0].text}` : ''}`}
        </div>
      )}
      {isBoard && sortedBy !== 'next' && !isPublic && (
        <div className="next">
          <span className="text">
            <span className={next.waiting ? 'text-primary' : 'text-danger'}>
              {next.waiting ? 'Waiting' : 'Next'}
              :&nbsp;
            </span>
            <span className={next.waiting ? 'text-primary' : ''}>
              {next.text ? next.text : ''}
            </span>
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
  isPublic: false,
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
  isPublic: PropTypes.bool,
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
