import React from 'react';
import PropTypes from 'prop-types';

export default function PersonStamp(props) {
  // temp for airtable data
  // TODO: replace with name from real API
  const {
    name,
    permalink,
    image_url,
    org_name,
    logo_url,
  } = props;

  return (
    <div
      className="personStamp"
    >
      <a href={`https://www.crunchbase.com/person/${permalink}`} target="_blank" rel="noopener noreferrer">
        <div className="imageWrapper" style={{ backgroundImage: `url(${image_url})` }}>
          <div className="orgLogoWrapper" style={{ backgroundImage: `url(${logo_url})` }} />
        </div>
        <div className="content">
          <h1 className="clamp2">
            {name}
          </h1>
          <span className="clamp2">{org_name}</span>
        </div>
      </a>
    </div>
  );
}

PersonStamp.defaultProps = {
  name: '',
  permalink: '',
  image_url: '',
  org_name: '',
  logo_url: '',
};

PersonStamp.propTypes = {
  name: PropTypes.string,
  permalink: PropTypes.string,
  image_url: PropTypes.string,
  org_name: PropTypes.string,
  logo_url: PropTypes.string,
};
