import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import { useImage } from 'react-image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GreySquare from '../../imgs/greySquare.jpg';

function ImgComp(props) {
  const { imgSrc = '', alt = '' } = props;
  const { src } = useImage({
    srcList: imgSrc || GreySquare,
  });
  return <img src={src} alt={alt || ''} className="responsiveImg" />;
}

export default function Person(props) {
  // temp for airtable data
  // TODO: replace with name from real API
  const name = `${props['first name']} ${props['last name']}`;
  const {
    image_id,
    primary_job_title,
    primary_organization,
    matches = {
      keywords: ['one', 'two'],
      raise: true,
      location: false,
      name: false,
      org: false,
    },
    isLead,
    isOpen,
    isImpact,
  } = props;
  // TODO: replace with data from real API
  const primary_organization_logo = ''; // placeholder
  const matchForPercentage = { ...matches };
  delete matchForPercentage.name;
  delete matchForPercentage.org;
  let percentageMatch = (matchForPercentage.keywords && matchForPercentage.keywords.length) || 0;
  if (matchForPercentage.raise) percentageMatch += 1;
  if (matchForPercentage.location) percentageMatch += 1;
  // fake for now
  // TODO: remove this when we have real data
  percentageMatch = 5;
  percentageMatch = Math.floor((percentageMatch / 7) * 100);

  return (
    <div className="person">
      <div className="thumb">
        <Suspense fallback={<Spinner animation="border" role="status" size="sm" />}>
          <ImgComp imgSrc={image_id} alt={name} />
        </Suspense>
      </div>
      <div className="content">
        <div>
          <h1>{name}</h1>
        </div>
        <div className="d-flex details">
          <div className="orgLogoWrapper">
            <Suspense fallback={<Spinner animation="border" role="status" size="sm" />}>
              <ImgComp imgSrc={primary_organization_logo} alt={name} />
            </Suspense>
          </div>
          <div className="orgText">
            <div>
              {`${primary_job_title}${primary_job_title && ','}`}
              &nbsp;
              {primary_organization}
            </div>
          </div>
        </div>
      </div>
      <div className="controls">
        <Button
          variant="icon-info"
          className="iconBtn addBtn"
        >
          <FontAwesomeIcon icon="plus-circle" />
        </Button>
        <div className="percentageMatch">
          {`${percentageMatch}%`}
        </div>
      </div>
    </div>
  );
}

Person.defaultProps = {
  image_id: '',
  primary_job_title: '',
  primary_organization: '',
  matches: {},
  isLead: false,
  isOpen: false,
  isImpact: false,
};

Person.propTypes = {
  image_id: PropTypes.string,
  primary_job_title: PropTypes.string,
  primary_organization: PropTypes.string,
  matches: PropTypes.shape({
    properties: PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.bool]),
    ),
  }),
  isLead: PropTypes.bool,
  isOpen: PropTypes.bool,
  isImpact: PropTypes.bool,
};
