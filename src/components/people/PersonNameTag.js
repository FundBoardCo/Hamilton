import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function OrgLogo(props) {
  const { URL } = props;
  if (URL) {
    return (
      <div
        className="orgLogoWrapper"
        style={{ backgroundImage: `url(${URL})` }}
      />
    );
  }
  return null;
}

function JobTitle(props) {
  const { title, orgName } = props;
  if (title || orgName) {
    return (
      <div className="jobTitle">
        <span style={{ marginRight: '0.25em' }}>
          {`${title}${title && ','}`}
        </span>
        <span>
          {orgName}
        </span>
      </div>
    );
  }
  return null;
}

export default function InvestorData(props) {
  const { data = {}, path, isFounder } = props;

  const {
    name,
    image_url = '',
    primary_job_title = '',
    primary_organization = {},
    status,
  } = data;

  let {
    primary_organization_logo,
    primary_organization_name,
    primary_organization_homepage,
  } = data;

  primary_organization_logo = primary_organization_logo
    || primary_organization.image_url
    || '';
  primary_organization_name = primary_organization_name
    || primary_organization.name
    || '';
  primary_organization_homepage = primary_organization_homepage
    || primary_organization.homepage
    || '';

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
    <div className="personNameTag">
      <section className="profileHeader mb-4">
        <div className="thumbCol">
          <div className="thumb" style={{ backgroundImage: `url(${image_url})` }} />
        </div>
        <div className="d-flex flex-column">
          <h1>{name}</h1>
          {primary_organization_homepage ? (
            <a
              className="orgDetails"
              href={primary_organization_homepage}
              target="_blank"
              rel="noopener noreferrer"
              data-track={`${path}InvestorHomepage`}
            >
              <OrgLogo URL={primary_organization_logo} />
              <JobTitle title={primary_job_title} orgName={primary_organization_name} />
            </a>
          ) : (
            <span className='orgDetails'>
              <OrgLogo URL={primary_organization_logo} />
              <JobTitle title={primary_job_title} orgName={primary_organization_name} />
            </span>
          )}
        </div>
      </section>
      {!isFounder && (
        <section className={`mb-2 d-flex ${validationProps.classes}`}>
          {validationProps.faIcon && (
            <FontAwesomeIcon
              icon={validationProps.faIcon}
              className="mr-1"
              style={{ marginTop: '0.2em' }}
            />
          )}
          <span>
            {validationProps.text}
          </span>
        </section>
      )}
    </div>
  );
}

InvestorData.defaultProps = {
  data: {},
  path: '',
  isFounder: false,
};

InvestorData.propTypes = {
  data: PropTypes.shape({
    params: PropTypes.objectOf(PropTypes
      .oneOfType([PropTypes.bool, PropTypes.string, PropTypes.objectOf(PropTypes.string)])),
  }),
  path: PropTypes.string,
  isFounder: PropTypes.bool,
};

OrgLogo.defaultProps = {
  URL: '',
};

OrgLogo.propTypes = {
  URL: PropTypes.string,
};

JobTitle.defaultProps = {
  title: '',
  orgName: '',
};

JobTitle.propTypes = {
  title: PropTypes.string,
  orgName: PropTypes.string,
};
