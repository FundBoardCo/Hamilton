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
import { isEmptyish } from '../../utils';

function SearchQuery(props) {
  const {
    label,
    value,
    action,
    saveKey,
    setTo,
    restore,
    onClick,
  } = props;
  const valIsEmptyish = isEmptyish(value);
  let text = value;
  if (typeof value === 'boolean') {
    text = label;
  } else if (valIsEmptyish) {
    text = restore;
  }

  const opts = {
    action,
    saveKey,
    setTo: valIsEmptyish ? restore : setTo,
  };

  return (
    <Button
      variant="text"
      className={`mr-2 flex-shrink-0 ${valIsEmptyish ? 'tx-lineThrough' : ''}`}
      onClick={() => onClick(opts)}
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
  const [showOnBoard, setShowOnBoard] = useState(false);
  // eslint-disable-next-line max-len
  const searchResults = showOnBoard ? rawResults : rawResults.filter(s => !investorIds.includes(s.uuid));
  // search query values
  const searchedText = useSelector(state => state.search.searchedText);
  const searchKeywords = useSelector(state => state.search.keywords) || [];
  const searchRaise = useSelector(state => state.search.raise);
  const searchLocation = useSelector(state => state.search.location) || '';
  const searchOnlyLeads = useSelector(state => state.search.onlyLeads);
  const searchOnlyDiverse = useSelector(state => state.search.onlyDiverse);
  const searchOnlyOpen = useSelector(state => state.search.onlyOpen);
  const searchOnlyLocal = useSelector(state => state.search.onlyLocal);
  const searchRemote = useSelector(state => state.search.remote);
  const prevQuery = useSelector(state => state.search.prevQuery) || {};
  const searchQuery = [
    {
      label: 'Text',
      value: searchedText,
      action: types.SEARCH_SET_SEARCHTEXT,
      saveKey: 'text',
      setTo: '',
      restore: prevQuery.searchedText,
    },
    {
      label: 'Keywords',
      value: searchKeywords.join(', '),
      action: types.SEARCH_SET_KEYWORDS,
      saveKey: 'keywords',
      setTo: [],
      restore: prevQuery.keywords,
    },
    {
      label: 'Raise',
      value: searchRaise,
      action: types.SEARCH_SET_RAISE,
      saveKey: 'raise',
      setTo: false,
      restore: prevQuery.raise,
    },
    {
      label: 'Location',
      value: searchLocation,
      action: types.SEARCH_TOGGLE_LOCATION,
      saveKey: 'location',
      setTo: '',
      restore: prevQuery.location,
    },
    {
      label: 'Local',
      value: searchOnlyLocal,
      action: types.SEARCH_SET_ONLYLOCAL,
      saveKey: 'onlyLocal',
      setTo: false,
      restore: prevQuery.onlyLocal,
    },
    {
      label: 'Remote',
      value: searchRemote,
      action: types.SEARCH_SET_REMOTE,
      saveKey: 'remote',
      setTo: false,
      restore: prevQuery.remote,
    },
    {
      label: 'Leads',
      value: searchOnlyLeads,
      action: types.SEARCH_SET_ONLYLEADS,
      saveKey: 'onlyLeads',
      setTo: false,
      restore: prevQuery.onlyLeads,
    },
    {
      label: 'Diverse',
      value: searchOnlyDiverse,
      action: types.SEARCH_SET_ONLYDIVERSE,
      saveKey: 'onlyDiverse',
      setTo: false,
      restore: prevQuery.onlyDiverse,
    },
    {
      label: 'Open',
      value: searchOnlyOpen,
      action: types.SEARCH_SET_ONLYOPEN,
      saveKey: 'onlyOpen',
      setTo: false,
      restore: prevQuery.onlyOpen,
    },
  ];

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [page, setPage] = useState(1);

  const onDetailClick = () => {
    setDetailsOpen(!detailsOpen);
  };

  const onShowBoardClick = () => {
    setShowOnBoard(!showOnBoard);
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

  const toggleSearchQuery = opts => {
    const {
      action,
      saveKey,
      setTo,
    } = opts;

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
        <Button variant="link" onClick={onShowBoardClick}>
          <strong className="txs-3">
            <FontAwesomeIcon
              icon={showOnBoard ? 'eye-slash' : 'eye'}
              className="mr-2"
            />
            {showOnBoard ? 'Hide ' : 'Show '}
            investors already on my FundBoard
          </strong>
        </Button>
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
          .filter(s => !isEmptyish(s.value) || !isEmptyish(s.restore))
          .map(s => <SearchQuery {...s} key={s.saveKey} onClick={toggleSearchQuery} />)}
      </div>
      <div className="results">
        {searchResults.map((r, i) => {
          const investorStatus = ownInvestors[r.uuid] || {};
          const alreadyOnBoard = investorIds.includes(r.uuid);
          const personProps = {
            ...r,
            ...investorStatus, // overwrite with user's data
            investorStatus,
            alreadyOnBoard,
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
  restore: '',
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
  restore: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  onClick: PropTypes.func,
};
