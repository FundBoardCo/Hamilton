import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { useImage } from 'react-image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GreySquare from '../../imgs/greySquare.jpg';

function ImgComp(params) {
  const { imgSrc = '', alt = '' } = params;
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
    uuid,
    image_id,
    primary_job_title,
    primary_organization,
    matches,
    // isLead,
    // isOpen,
    // isImpact,
    isBoard,
  } = props;
  // TODO: replace with data from real API
  const primary_organization_logo = ''; // placeholder
  const matchForPercentage = { ...matches };
  let percentageMatch = (matchForPercentage.keywords && matchForPercentage.keywords.length) || 0;
  if (matchForPercentage.raise) percentageMatch += 1;
  if (matchForPercentage.location) percentageMatch += 1;
  percentageMatch = Math.floor((percentageMatch / 7) * 100);

  const investors = useSelector(state => state.board.ids) || [];
  const isOnBoard = investors.includes(uuid);

  const history = useHistory();

  const showPerson = () => {
    const root = isBoard ? 'board' : 'search';
    history.push(`/${root}/${uuid}`);
  };

  const dispatch = useDispatch();

  const addInvestor = () => dispatch({
    type: 'BOARD_ADD',
    id: uuid,
  });

  const removeInvestor = () => dispatch({
    type: 'BOARD_REMOVE',
    id: uuid,
  });

  const toggleInvestor = () => {
    if (isOnBoard) {
      removeInvestor();
    } else {
      addInvestor();
    }
  };

  // TODO: add a "are you sure" step to removing if it's on the board page.

  let addBtnProps = {
    text: isOnBoard ? 'Remove from my FundBoard' : 'Add to my FundBoard',
    variant: isOnBoard ? 'icon-warning' : 'icon-info',
    faIcon: isOnBoard ? 'minus-circle' : 'plus-circle',
    action: toggleInvestor,
  };

  if (isBoard) {
    addBtnProps = {
      text: 'See Investor Details',
      variant: 'icon-info',
      faIcon: 'ellipsis-h',
      action: showPerson,
    };
  }

  return (
    <div
      className="person"
    >
      <button className="thumb" onClick={showPerson} type="button">
        <Suspense fallback={<Spinner animation="border" variant="info" role="status" size="sm" />}>
          <ImgComp imgSrc={image_id} alt={name} />
        </Suspense>
      </button>
      <div className="content">
        <div>
          <h1>
            <button
              onClick={showPerson}
              type="button"
            >
              {name}
            </button>
          </h1>
        </div>
        <div className="d-flex details">
          <div className="orgLogoWrapper">
            <Suspense fallback={<Spinner animation="border" variant="info" role="status" size="sm" />}>
              <ImgComp imgSrc={primary_organization_logo} alt={name} />
            </Suspense>
          </div>
          <div className="orgText">
            <div>
              {`${primary_job_title}${primary_job_title && ','}`}
              {`${primary_job_title ? '\xa0' : ''}`}
              {primary_organization}
            </div>
          </div>
        </div>
      </div>
      <div className="controls">
        <Button
          variant={addBtnProps.variant}
          className="iconBtn addBtn"
          onClick={addBtnProps.action}
        >
          <FontAwesomeIcon icon={addBtnProps.faIcon} />
          <span className="sr-only">{addBtnProps.text}</span>
        </Button>
        <div className="percentageMatch">
          {`${percentageMatch}%`}
        </div>
      </div>
    </div>
  );
}

Person.defaultProps = {
  uuid: 'not found',
  image_id: '',
  primary_job_title: '',
  primary_organization: '',
  matches: {
    keywords: ['one', 'two'],
    raise: true,
    location: false,
    name: false,
    org: false,
  },
  // isLead: false,
  // isOpen: false,
  // isImpact: false,
  isBoard: false,
};

Person.propTypes = {
  uuid: PropTypes.string,
  image_id: PropTypes.string,
  primary_job_title: PropTypes.string,
  primary_organization: PropTypes.string,
  matches: PropTypes.shape({
    properties: PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.bool]),
    ),
  }),
  // isLead: PropTypes.bool,
  // isOpen: PropTypes.bool,
  // isImpact: PropTypes.bool,
  isBoard: PropTypes.bool,
};
