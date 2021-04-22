import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Person from '../../components/people/Person';
import DismissibleStatus from '../../components/DismissibleStatus';
import * as types from '../../actions/types';

function SearchQuery(props) {
  const {
    label,
    value,
    action,
    saveKey,
    setTo,
    onClick,
  } = props;
  const text = typeof value === 'boolean' ? label : value;
  return (
    <Button
      variant="text"
      className="mr-2 flex-shrink-0"
      onClick={() => onClick(action, saveKey, setTo)}
    >
      <i>
        <span className="text-primary mr-2">{text}</span>
      </i>
    </Button>
  );
}

export default function Search() {
  const rawResults = useSelector(state => state.search.results) || [];
  const searchStatus = useSelector(state => state.search.results_status) || '';
  const ownInvestors = useSelector(state => state.investors.ownInvestors) || {};
  const investorIds = Object.keys(ownInvestors);
  const loggedOutInvestorIDs = useSelector(state => state.investors.loggedOutInvestorIDs) || [];
  const numInvestors = investorIds.length ? investorIds.length : loggedOutInvestorIDs.length;
  const searchResults = rawResults.filter(s => !investorIds.includes(s.uuid));
  // search query values
  const searchedText = useSelector(state => state.search.searchedText);
  const searchKeywords = useSelector(state => state.search.keywords) || [];
  const searchRaise = useSelector(state => state.search.raise) || 100000;
  const searchLocation = useSelector(state => state.search.location) || '';
  const searchOnlyLeads = useSelector(state => state.search.onlyLeads);
  const searchOnlyDiverse = useSelector(state => state.search.onlyDiverse);
  const searchOnlyOpen = useSelector(state => state.search.onlyOpen);
  const searchOnlyLocal = useSelector(state => state.search.onlyLocal);
  const searchRemote = useSelector(state => state.search.remote);
  const searchQuery = [
    {
      label: 'Text',
      value: searchedText,
      action: types.SEARCH_SET_SEARCHTEXT,
      saveKey: 'text',
      setTo: '',
    },
    {
      label: 'Keywords',
      value: searchKeywords.join(', '),
      action: types.SEARCH_SET_KEYWORDS,
      saveKey: 'keywords',
      setTo: [],
    },
    {
      label: 'Raise',
      value: searchRaise,
      action: types.SEARCH_SET_RAISE,
      saveKey: 'raise',
      setTo: 100000,
    },
    {
      label: 'Location',
      value: searchLocation,
      action: types.SEARCH_SET_LOCATION,
      saveKey: 'location',
      setTo: '',
    },
    {
      label: 'Local',
      value: searchOnlyLocal,
      action: types.SEARCH_SET_ONLYLOCAL,
      saveKey: 'onlyLocal',
      setTo: false,
    },
    {
      label: 'Remote',
      value: searchRemote,
      action: types.SEARCH_SET_REMOTE,
      saveKey: 'remote',
      setTo: false,
    },
    {
      label: 'Leads',
      value: searchOnlyLeads,
      action: types.SEARCH_SET_ONLYLEADS,
      saveKey: 'onlyLeads',
      setTo: false,
    },
    {
      label: 'Diverse',
      value: searchOnlyDiverse,
      action: types.SEARCH_SET_ONLYDIVERSE,
      saveKey: 'onlyDiverse',
      setTo: false,
    },
    {
      label: 'Open',
      value: searchOnlyOpen,
      action: types.SEARCH_SET_ONLYOPEN,
      saveKey: 'onlyOpen',
      setTo: false,
    },
  ];

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [page, setPage] = useState(1);

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

  const toggleSearchQuery = (action, saveKey, setTo) => {
    dispatch({
      type: action,
      [saveKey]: setTo,
    });
    dispatch({
      type: 'SEARCH_GET_RESULTS_REQUESTED',
    });
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
            <span className="d-none d-md-inline">&nbsp;Potential </span>
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
      </div>
      <div className="mb-3 txs-2 tx-md-tx3">
        {investorIds.length > 0 ? (
          <span className="txs-3">
            {`You have ${numInvestors} ${numInvestors === 1 ? 'investor' : 'investors'} on your FundBoard. `}
            <a href="/public">
              <strong>Share it now to start getting introductions.</strong>
            </a>
          </span>
        ) : (
          <span>
            {`You have ${numInvestors} investors on your FundBoard. Start a new search to find matching investors to save to your `}
            <a href="/public">board.</a>
          </span>
        )}
      </div>
      <DismissibleStatus
        status={searchStatus}
        showSuccess={false}
        dissmissAction={types.SEARCH_GET_RESULTS_DISMISSED}
      />
      <div className="d-flex mb-2 txs-2 txs-md-tx3 flex-wrap">
        <span className="mr-2 flex-shrink-0">
          <strong>
            You searched for&nbsp;
          </strong>
          <span>
            (click to reset):
          </span>
        </span>
        {searchQuery
          .filter(s => {
            let test = false;
            if (s.value) test = true;
            if (Array.isArray(s.value)) test = s.value.length;
            return test;
          })
          .map(s => <SearchQuery {...s} key={s.saveKey} onClick={toggleSearchQuery} />)}
      </div>
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
            <Person key={r.uuid || r.permalink} {...personProps} />
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
                data-track="SearchLoadMore"
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

SearchQuery.defaultProps = {
  label: '',
  value: '',
  action: '',
  saveKey: '',
  setTo: '',
  onClick: {},
};

SearchQuery.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  action: PropTypes.string,
  saveKey: PropTypes.string,
  setTo: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.array, // this array is always empty
  ]),
  onClick: PropTypes.func,
};
