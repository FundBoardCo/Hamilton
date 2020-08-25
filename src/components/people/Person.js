import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { useImage } from 'react-image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import GreySquare from '../../imgs/greySquare.jpg';
import { capitalizeFirstLetter } from '../../utils';
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
  const extraLocations = useSelector(state => state.search.extraLocations);

  const matches = {
    keywords: [],
    raise: searchRaise >= raise_min && searchRaise <= raise_max,
    location:
      extraLocations.filter(l => l.city === location_city && l.state === location_state).length > 0,
  };
  searchKeywords.forEach(k => {
    if (description && description.includes(k.toLowerCase())) matches.keywords.push(k);
  });

  let percentageMatch = matches.keywords.length ? matches.keywords.length / 5 : 0;
  if (matches.raise) percentageMatch += 1;
  if (matches.location) percentageMatch += 1;
  percentageMatch = Math.floor((percentageMatch / 3) * 100);

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
              {name}
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
  name: PropTypes.string,
  image_url: PropTypes.string,
  primary_job_title: PropTypes.string,
  primary_organization: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.bool])),
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
};
