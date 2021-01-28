import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Person from '../../components/people/Person';
import DismissibleStatus from '../../components/DismissibleStatus';
import * as types from '../../actions/types';

export default function Search() {
  const searchKeywords = useSelector(state => state.search.keywords) || [];
  const searchRaise = useSelector(state => state.search.raise) || 100000;
  const searchLocation = useSelector(state => state.search.location) || '';
  const rawResults = useSelector(state => state.search.results) || [];
  const searchStatus = useSelector(state => state.search.results_status) || '';
  const ownInvestors = useSelector(state => state.investors.ownInvestors) || {};
  const investorIds = Object.keys(ownInvestors);
  const searchResults = rawResults.filter(s => !investorIds.includes(s.uuid));

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [page, setPage] = useState(1);

  const usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  });

  const onDetailClick = () => {
    setDetailsOpen(!detailsOpen);
  };

  const history = useHistory();

  const dispatch = useDispatch();

  useEffect(() => function cleanUp() {
    dispatch({
      type: types.SEARCH_GET_RESULTS_DISMISSED,
    });
  }, [dispatch]);

  const onEditClick = () => {
    history.push('search/menu');
    dispatch({ type: types.SEARCH_GET_RESULTS_DISMISSED });
  };

  const nextPage = () => {
    setPage(page + 1);
  };

  const lastIndexShown = searchResults.length < page * 100 ? searchResults.length : page * 100;

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
            {`${Object.keys(searchResults).length}`}
            <span className="d-none d-md-inline">&nbsp;Potential Lead</span>
            &nbsp;Investors
          </Button>
          <Button
            variant="primary-light"
            className="btnTn inlineBtn"
            onClick={onEditClick}
            data-track="EditSearch"
          >
            <FontAwesomeIcon icon="edit" className="mr-2" />
            <span className="d-none d-md-inline">New </span>
            Search
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
      <div className="mb-3 txs-2 tx-md-tx3">
        {searchResults.length > 0 && (
          <span>
            {`You have ${investorIds.length} investors on your FundBoard. Click on an investor to learn more about them and save them to your `}
            <a href="/board">board.</a>
          </span>
        )}
        {searchResults.length === 0 && (
          <span>
            {`You have ${investorIds.length} investors on your FundBoard. Start a new search to find matching investors to save to your `}
            <a href="/board">board.</a>
          </span>
        )}
      </div>
      <DismissibleStatus
        status={searchStatus}
        showSuccess={false}
        dissmissAction={types.SEARCH_GET_RESULTS_DISMISSED}
      />
      <div className="results">
        {searchResults.map((r, i) => {
          const investorStatus = ownInvestors[r.uuid] || {};
          const personProps = {
            ...r,
            ...investorStatus, // overwrite with user's data
            investorStatus,
          };
          if (i >= page * 100) return null;
          return (
            <Person key={r.uuid} {...personProps} />
          );
        })}
        {searchResults.length > 0 && (
          <div className="d-flex mt-4 mb-5">
            <span className="h5 text-primary">{`1 to ${lastIndexShown}`}</span>
            {searchResults.length > page * 100 && (
              <Button
                variant="info"
                className="ml-auto"
                onClick={nextPage}
              >
                Load more
              </Button>
            )}
          </div>
        )}
        {Object.keys(searchResults).length === 0 && searchStatus !== 'pending' && (
          <div className="p-2 text-info d-flex justify-content-center">
            <div>{searchStatus === 'succcess' && 'No results found.'}</div>
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
