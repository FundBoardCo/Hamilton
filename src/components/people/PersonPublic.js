import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { v4 as uuidv4 } from 'uuid';
import { capitalizeFirstLetter } from '../../utils';
import * as types from '../../actions/types';

export default function Person(props) {
  const {
    objectId,
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
    founderUUID,
    isMyPage,
    userEmail,
    disable,
  } = props;

  let {
    primary_organization_name = '',
  } = props;

  const { intros = {}, stage } = investorStatus;
  const notConnected = !stage || ['none', 'added'].includes(stage);
  const introedByUser = Object.keys(intros).map(k => intros[k].intro_email).includes(userEmail);

  let introNamesText = '';
  const introKeys = Object.keys(intros);
  const lastIntroName = introKeys.length ? intros[introKeys[0]].intro_name : '';
  if (introKeys.length === 1) {
    introNamesText = `Connection offered by ${lastIntroName}.`;
  } else if (introKeys.length > 1) {
    introNamesText = `${introKeys.length} connections offered, last offer by ${lastIntroName}.`;
  }

  const primary_organization_logo = primary_organization.image_url || '';
  primary_organization_name = primary_organization_name || primary_organization.name || '';

  const location = useLocation();
  const path = location.pathname.substring(1).split('/')[0];
  const capPath = capitalizeFirstLetter(path);

  const dispatch = useDispatch();

  const clickPerson = () => {
    if (notConnected && !introedByUser) {
      dispatch({
        type: types.PUBLIC_POST_INTRO_DISMISSED,
      });
      dispatch({
        type: types.MODAL_SET_OPEN,
        modal: 'makeIntro',
        modalProps: {
          ...investorStatus,
          objectId,
          isPublic: !isMyPage,
          investor: {
            name,
            primary_job_title,
            primary_organization_name,
          },
          founderUUID,
          userEmail,
          toEdit: uuidv4(),
          intro: {},
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
        disabled={disable || !notConnected || introedByUser}
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
        <div className="introText d-flex flex-column">
          {introNamesText && (
            <div className="mb-2">
              {introNamesText}
            </div>
          )}
          {notConnected ? (
            <div>
              {introedByUser ? 'You have offered to connect them.' : 'I can connect them to this investor.'}
            </div>
          ) : (
            <div>
              This investor has been connected.
            </div>
          )}
        </div>
      </button>
    </div>
  );
}

Person.defaultProps = {
  objectId: '',
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
  matches: {
    keywords: ['one', 'two'],
    raise: false,
    location: false,
    name: false,
    org: false,
  },
  status: '',
  investorStatus: {},
  founderUUID: '',
  founderName: '',
  isMyPage: false,
  userEmail: '',
  disable: false,
};

Person.propTypes = {
  objectId: PropTypes.string,
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
  founderUUID: PropTypes.string,
  founderName: PropTypes.string,
  isMyPage: PropTypes.bool,
  userEmail: PropTypes.string,
  disable: PropTypes.bool,
};
