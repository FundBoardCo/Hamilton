import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { capitalizeFirstLetter } from '../../utils';
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
    status,
    investorStatus = {},
    founderID,
    isMyPage,
  } = props;

  const { intro_name, intro_date, stage } = investorStatus;
  const notIntroed = !stage || ['none', 'added'].includes(stage);

  const primary_organization_logo = primary_organization.image_url || '';
  const primary_organization_name = primary_organization.name || '';

  const location = useLocation();
  const path = location.pathname.substring(1).split('/')[0];
  const capPath = capitalizeFirstLetter(path);

  const dispatch = useDispatch();

  const clickPerson = () => {
    if (notIntroed) {
      dispatch({
        type: types.PUBLIC_POST_INVESTORSTATUS_DISMISSED,
      });
      dispatch({
        type: types.MODAL_SET_OPEN,
        modal: 'makeIntro',
        modalProps: {
          ...investorStatus,
          isPublic: !isMyPage,
          investor: {
            name,
            primary_job_title,
            primary_organization_name,
          },
          founderID,
        },
      });
    }
  };

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
    <div className="personWrapper Board Public">
      <button
        className="person"
        onClick={clickPerson}
        type="button"
        disabled={!notIntroed}
        data-track={`${capPath}Person`}
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
        <div className="introText">
          {notIntroed ? (
            <span className="btn btn-link">
              I can introduce this investor
            </span>
          ) : (
            <span>
              {`Introduced ${
                intro_name ? ` by ${intro_name}` : ''
              }${
                intro_date ? ` on ${moment(intro_date).format('MMMM d, yyyy h:mma')}` : ''
              }`}
            </span>
          )}
        </div>
      </button>
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
  status: '',
  investorStatus: {},
  founderID: '',
  isMyPage: false,
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
  status: PropTypes.string,
  investorStatus: PropTypes.shape({
    id: PropTypes.string,
    notes: PropTypes
      .objectOf(PropTypes
        .objectOf(PropTypes
          .oneOfType([PropTypes.string, PropTypes.bool]))),
    intro: PropTypes.objectOf(PropTypes.string),
  }),
  founderID: PropTypes.string,
  isMyPage: PropTypes.bool,
};
