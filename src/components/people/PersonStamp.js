import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import Spinner from 'react-bootstrap/Spinner';
import { useImage } from 'react-image';
import GreySquare from '../../imgs/greySquare.jpg';

function ImgComp(params) {
  const { imgSrc = '', alt = '' } = params;
  const { src } = useImage({
    srcList: imgSrc || GreySquare,
  });
  return <img src={src} alt={alt || ''} className="responsiveImg" />;
}

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
        <div className="imageWrapper">
          <Suspense fallback={<Spinner animation="border" variant="info" role="status" size="sm" />}>
            <ImgComp imgSrc={image_url} alt={name} />
          </Suspense>
          <div className="orgLogoWrapper">
            <Suspense fallback={<Spinner animation="border" variant="info" role="status" size="sm" />}>
              <ImgComp imgSrc={logo_url} alt={org_name} />
            </Suspense>
          </div>
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
