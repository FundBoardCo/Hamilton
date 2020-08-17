import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Person from '../../components/people/Person';
import DissmissibleStatus from '../../components/DissmissibleStatus';
import * as types from '../../actions/types';

export default function Search() {
  const searchKeywords = useSelector(state => state.search.keywords) || [];
  const searchRaise = useSelector(state => state.search.raise) || 100000;
  const searchLocation = useSelector(state => state.search.location) || '';
  const searchResults = useSelector(state => state.search.records) || [];
  console.log(searchResults)
  const searchStatus = useSelector(state => state.search.results_status) || '';

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
      <DissmissibleStatus
        status={searchStatus}
        dissmissAction={types.SEARCH_GET_RESULTS_DISMISSED}
      />
      <div className="results">
        {Object.keys(searchResults).map(k => {
          const personProps = { ...searchResults[k] };
          //personProps.uuid = k;
          return (
            <Person key={k} {...personProps} />
          );
        })}
        {Object.keys(searchResults).length === 0 && (
          <div className="p-2 text-info">
            <div>No results found.</div>
            <Button
              variant="primary"
              onClick={onEditClick}
              data-track="NoResultsNewSearch"
            >
              New Search
            </Button>
          </div>
        )}
      </div>
    </Row>
  );
}

