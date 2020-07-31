import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Spinner from 'react-bootstrap/Spinner';
import Person from '../../components/people/Person';

export default function Search() {
  const searchKeywords = useSelector(state => state.search.keywords) || [];
  const searchRaise = useSelector(state => state.search.raise) || 100000;
  const searchLocation = useSelector(state => state.search.location) || '';
  const searchResults = useSelector(state => state.search.results) || [];
  const searchState = useSelector(state => state.search.results_status) || '';

  const [detailsOpen, setDetailsOpen] = useState(false);

  const usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  });

  const onDetailClick = () => {
    setDetailsOpen(!detailsOpen);
  };

  const history = useHistory();

  const onEditClick = () => {
    history.push('search/menu');
  };

  return (
    <Row id="PageSearch" className="pageContainer">
      <div className="searchDetailsBar">
        <div className="primaryDetails">
          <Button
            className="primaryDetailsLink"
            variant="text-light"
            onClick={onDetailClick}
            data-track="ToggleSearchDetails"
          >
            {`${Object.keys(searchResults).length} investors match`}
          </Button>
          {searchState === 'pending' && !searchResults.length && (
            <Spinner animation="border" variant="info" />
          )}
          <Button
            variant="primary-light"
            className="btnTn inlineBtn"
            onClick={onEditClick}
            data-track="EditSearch"
          >
            <FontAwesomeIcon icon="edit" />
            edit
          </Button>
        </div>
        <div className={`secondaryDetails ${detailsOpen ? '' : 'sr-only'}`}>
          <p>
            {`You searched for: ${searchKeywords.join()}`}
          </p>
          <p>
            {`Raise: ${usdFormatter.format(searchRaise)}`}
          </p>
          <p>
            {`Location: ${searchLocation}`}
          </p>
        </div>
      </div>
      <div className="results">
        {Object.keys(searchResults).map(k => {
          const personProps = { ...searchResults[k] };
          personProps.uuid = k;
          const pKey = personProps.permalink || personProps.image_id;
          return (
            <Person key={pKey} {...personProps} />
          );
        })}
      </div>
    </Row>
  );
}
