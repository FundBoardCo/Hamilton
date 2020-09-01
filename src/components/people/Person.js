import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { useImage } from 'react-image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GreySquare from '../../imgs/greySquare.jpg';
import { capitalizeFirstLetter, calcMatch } from '../../utils';
import * as types from '../../actions/types';
import ErrorBoundary from '../ErrorBoundary';

function ImgComp(params) {
  const { imgSrc = '', alt = '' } = params;
  const { src } = useImage({
    srcList: imgSrc || GreySquare,
  });
  return <img src={src} alt={alt || ''} className="responsiveImg" />;
}

export default function Person(props) {
  const {
    uuid,
    name,
    image_url = '',
    primary_job_title = '',
    primary_organization = {},
    description = '',
    location_city,
    location_state,
    raise_min,
    raise_max,
    // isLead = false,
    // isOpen = false,
    // isImpact = false,
    isBoard = false,
  } = props;

  const primary_organization_logo = primary_organization.image_url || '';
  const primary_organization_name = primary_organization.name || '';

  const searchKeywords = useSelector(state => state.search.keywords);
  const searchRaise = useSelector(state => state.search.raise);
  const searchLocation = useSelector(state => state.search.location);
  const extraLocations = useSelector(state => state.search.extraLocations);

  const calcedMatch = calcMatch({
    ...props,
    keywords: searchKeywords,
    raise: searchRaise,
    location: searchLocation,
    extraLocations,
  });

  const { percentageMatch, matches } = calcedMatch;

  const investors = useSelector(state => state.board.ids) || [];
  const isOnBoard = investors.includes(uuid);

  const history = useHistory();

  const showPerson = () => {
    const root = isBoard ? 'board' : 'search';
    history.push(`/${root}/${uuid}`);
  };

  const location = useLocation();

  const path = capitalizeFirstLetter(location.pathname.substring(1));

  const dispatch = useDispatch();

  const addInvestor = () => dispatch({
    type: types.BOARD_ADD,
    id: uuid,
    data: { ...props},
  });

  const removeInvestor = () => dispatch({
    type: types.BOARD_REMOVE,
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
    track: isOnBoard ? 'remove' : 'add',
    action: toggleInvestor,
  };

  if (isBoard) {
    addBtnProps = {
      text: 'See Investor Details',
      variant: 'icon-info',
      faIcon: 'ellipsis-h',
      track: 'details',
      action: showPerson,
    };
  }

  return (
    <div
      className="person"
    >
      <button
        className="thumb"
        onClick={showPerson}
        type="button"
        data-track={`${path}PersonThumb`}
      >
        <Suspense fallback={<Spinner animation="border" variant="info" role="status" size="sm" />}>
          <ErrorBoundary>
            <ImgComp imgSrc={image_url} alt={name} />
          </ErrorBoundary>
        </Suspense>
      </button>
      <div className="content">
        <div>
          <h1>
            <button
              onClick={showPerson}
              type="button"
              data-track={`${path}PersonShow`}
            >
              {name || uuid}
            </button>
          </h1>
        </div>
        <div className="d-flex details">
          {primary_organization_logo && (
            <div className="orgLogoWrapper">
              <Suspense fallback={<Spinner animation="border" variant="info" role="status" size="sm" />}>
                <ErrorBoundary>
                  <ImgComp imgSrc={primary_organization_logo} alt={primary_organization_name} />
                </ErrorBoundary>
              </Suspense>
            </div>
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
        <Button
          variant={addBtnProps.variant}
          className="iconBtn addBtn"
          onClick={addBtnProps.action}
          data-track={`${path}PersonAdd-${addBtnProps.track}`}
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
  description: '',
  location_city: '',
  location_state: '',
  raise_min: 0,
  raise_max: 0,
  matches: {
    keywords: ['one', 'two'],
    raise: false,
    location: false,
    name: false,
    org: false,
  },
  percentageMatch: 0,
  // isLead: false,
  // isOpen: false,
  // isImpact: false,
  isBoard: false,
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
  description: PropTypes.string,
  location_city: PropTypes.string,
  location_state: PropTypes.string,
  raise_min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  raise_max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  matches: PropTypes.shape({
    keywords: PropTypes.arrayOf(PropTypes.string),
    raise: PropTypes.bool,
    location: PropTypes.bool,
    name: PropTypes.bool,
    org: PropTypes.bool,
  }),
  percentageMatch: PropTypes.number,
  // isLead: PropTypes.bool,
  // isOpen: PropTypes.bool,
  // isImpact: PropTypes.bool,
  isBoard: PropTypes.bool,
};
