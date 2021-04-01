import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import { statusIsError, getSearchLocations } from '../utils';
import * as types from '../actions/types';
import { ZIPDISTANCE } from '../constants';

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

function SectionTitle(params) {
  const {
    text,
    faIcon,
    detailText,
    subText,
    link,
  } = params;
  return (
    <div className="sectionTitle">
      <div className="title">
        <span className="iconDisc bg-primary">
          <FontAwesomeIcon icon={faIcon} />
        </span>
        <h2>{text}</h2>
        {detailText && (
          <span className="detail">
            {detailText}
          </span>
        )}
      </div>
      {subText && (
        <p>
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {subText}
            </a>
          ) : (
            <span>{subText}</span>
          )}
        </p>
      )}
    </div>
  );
}

export default function SearchMenu() {
  const form = useRef(null);

  let airtableKeywords = useSelector(state => state.airtable.keywords) || {};
  airtableKeywords = airtableKeywords.data || [];
  // This fixes a bug with spaces from the capitalize function
  // TODO: remote after April 2021 patch has been live for a while
  airtableKeywords = airtableKeywords.map(a => a.trim());

  let searchKeywords = useSelector(state => state.search.keywords) || [];
  // This fixes a bug with spaces from the capitalize function
  // TODO: remote after April 2021 patch has been live for a while
  searchKeywords = searchKeywords.map(s => s.trim());

  const searchRaise = useSelector(state => state.search.raise) || 100000;
  const [raiseValue, setRaiseValue] = useState(searchRaise);
  const [raiseValid, setRaiseValid] = useState(true);

  const searchOnlyLeads = useSelector(state => state.search.onlyLeads);
  const searchOnlyDiverse = useSelector(state => state.search.onlyDiverse);
  const searchOnlyOpen = useSelector(state => state.search.onlyOpen);

  const searchedText = useSelector(state => state.search.searchedText);

  const searchLocation = useSelector(state => state.search.location) || '';
  // use local state to handle invalid entries without recording them
  const [locationValue, setLocationValue] = useState(searchLocation);
  const [locationValid, setLocationValid] = useState(true);

  const extraLocations = useSelector(state => state.search.extraLocations) || [];
  const extraZipcodes_status = useSelector(state => state.search.extraZipcodes_status);
  const locations = searchLocation
  && typeof searchLocation === 'string'
  && Array.isArray(extraLocations)
    ? getSearchLocations(searchLocation, extraLocations) : {};
  const { searchedCity = [], searchedSecondaryCities = [] } = locations;

  const storedRemote = useSelector(state => state.search.remote) || '';

  const [validated, setValidated] = useState(false);

  const [tileSearchFor, setTileSearchFor] = useState('');
  const [showTileWarning, setShowTileWarning] = useState(false);
  let wordsToShow = Array.isArray(airtableKeywords)
    ? airtableKeywords
    : [];
  if (tileSearchFor) {
    wordsToShow = wordsToShow.filter(w => (
      w.toLowerCase().includes(tileSearchFor.toLowerCase())
    ));
  }

  const dispatch = useDispatch();

  const history = useHistory();

  const setKeywords = keywords => dispatch({
    type: types.SEARCH_SET_KEYWORDS,
    keywords,
  });

  const setRaise = raise => dispatch({
    type: types.SEARCH_SET_RAISE,
    raise,
  });

  const setLocation = location => dispatch({
    type: types.SEARCH_SET_LOCATION,
    location,
  });

  const setOnlyLeads = onlyLeads => dispatch({
    type: types.SEARCH_SET_ONLYLEADS,
    onlyLeads,
  });

  const setOnlyDiverse = onlyDiverse => dispatch({
    type: types.SEARCH_SET_ONLYDIVERSE,
    onlyDiverse,
  });

  const setOnlyOpen = onlyOpen => dispatch({
    type: types.SEARCH_SET_ONLYOPEM,
    onlyOpen,
  });

  const setRemote = remote => dispatch({
    type: types.SEARCH_SET_REMOTE,
    remote,
  });

  const setSearchedText = text => dispatch({
    type: types.SEARCH_SET_SEARCHTEXT,
    text,
  });

  const onClickClearSearchText = () => {
    setSearchedText('');
  };

  const onTileClick = (word, active) => {
    const normalizedWord = word.toLowerCase();
    if (active) {
      setKeywords(searchKeywords.filter(w => w !== normalizedWord));
      setShowTileWarning(false);
    } else if (searchKeywords.length < 5) {
      setKeywords([...searchKeywords, normalizedWord]);
      setShowTileWarning(false);
    } else {
      setShowTileWarning(true);
    }
  };

  const onRemoveKeyword = w => {
    setKeywords(searchKeywords.filter(kw => kw !== w));
    setShowTileWarning(false);
  };

  const onRaiseChange = e => {
    const input = e.currentTarget;
    const val = Number(e.target.value);
    setValidated(true);
    if (input.checkValidity()) {
      setRaiseValid(true);
      setRaiseValue(val);
      setRaise(val);
    } else {
      setRaiseValid(false);
      setRaiseValue(val);
    }
  };

  const onOnlyLeadsChange = val => {
    setOnlyLeads(val);
  };

  const onOnlyDiverseChange = val => {
    setOnlyDiverse(val);
  };

  const onOnlyOpenChange = val => {
    setOnlyOpen(val);
  };

  const onRemoteChange = val => {
    setRemote(val);
  };

  const onLocationChange = e => {
    const input = e.currentTarget;
    const val = e.target.value;
    setValidated(true);
    if (input.checkValidity()) {
      setLocationValid(true);
      setLocationValue(val);
      setLocation(val);
    } else {
      setLocationValid(false);
      setLocationValue(val);
    }
  };

  const getResults = () => {
    // the params don't currently do anything, keep them for when search is an API call.
    const params = {};
    params.keywords = searchKeywords;
    params.raise = searchRaise;
    params.onlyLeads = searchOnlyLeads;
    params.onlyDiverse = searchOnlyDiverse;
    params.onlyOpen = searchOnlyOpen;
    params.location = searchedCity;
    params.secondaryLocation = searchedSecondaryCities;
    params.remote = storedRemote;

    return dispatch({
      type: 'SEARCH_GET_RESULTS_REQUESTED',
      params,
    });
  };

  const closeModal = () => {
    history.push('/search');
  };

  const closeAndSearch = () => {
    const formNode = form.current;
    setValidated(true);
    if (formNode.checkValidity() !== false) {
      getResults();
      history.push('/search');
    }
  };

  useEffect(() => {
    dispatch({
      type: types.AIRTABLE_GET_KEYWORDS_REQUESTED,
    });
  }, [dispatch]);

  useEffect(() => {
    if (searchLocation) {
      dispatch({
        type: 'SEARCH_SET_LOCATION',
        location: searchLocation,
      });
    }
  }, [searchLocation, dispatch]);

  let extraZipcodesText = extraZipcodes_status;

  if (!searchLocation) {
    extraZipcodesText = 'waiting for your zip code.';
  } else if (!extraZipcodes_status || extraZipcodes_status === 'succeeded') {
    const numCities = searchedSecondaryCities.length;
    extraZipcodesText = `${numCities} cities within ${ZIPDISTANCE} miles of ${searchLocation} found.`;
  }

  const extraZipcodesClass = statusIsError(extraZipcodes_status) ? 'text-warning' : 'text-info';

  return (
    <Modal
      size="lg"
      aria-labelledby="Modal-Title"
      centered
      show
      scrollable
      onHide={closeModal}
      className="modal-sidebar-left modal-searchMenu"
    >
      <Modal.Header closeButton>
        <Modal.Title className="sr-only">
          <h1>Search Settings</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <SectionTitle
          faIcon="search"
          text="Search By Name or Organization"
        />
        <InputGroup className="mb-5">
          <FormControl
            type="text"
            value={searchedText}
            placeholder="Name or Organization"
            onChange={e => setSearchedText(e.target.value)}
            aria-label="Search for an investor by name or organization."
          />
          <InputGroup.Append>
            <Button
              variant="outline-primary"
              onClick={onClickClearSearchText}
            >
              <FontAwesomeIcon className="mr-1 ml-1" icon="times" />
            </Button>
          </InputGroup.Append>
        </InputGroup>
        <SectionTitle
          text="My Keywords"
          faIcon="key"
          detailText={`${searchKeywords.length} selected`}
          subText="Choose up to 5 words that describe your startup"
        />
        <div className="txs-2 text-info mb-2 d-flex flex-wrap">
          <span>Selected:&nbsp;</span>
          {searchKeywords.map(w => (
            <Button
              variant="link"
              className="text-info mr-2"
              onClick={() => onRemoveKeyword(w)}
              key={w}
            >
              {`${w} (x)`}
            </Button>
          ))}
        </div>
        <InputGroup className="mb-2">
          <FormControl
            type="text"
            value={tileSearchFor}
            placeholder="Search for a keyword"
            onChange={e => setTileSearchFor(e.target.value)}
            aria-label="Search for keyword to include in your search."
          />
          <InputGroup.Append>
            <Button
              variant="outline-primary"
              onClick={() => setTileSearchFor('')}
            >
              <FontAwesomeIcon className="mr-1 ml-1" icon="times" />
            </Button>
          </InputGroup.Append>
        </InputGroup>
        <div className="tilesWrapper mb-5">
          <div className="tiles">
            {wordsToShow.map(w => {
              const active = searchKeywords.includes(w.toLowerCase());
              return (
                <button
                  className={`tile ${active ? 'active' : ''}`}
                  onClick={() => onTileClick(w, active)}
                  key={w}
                  tabIndex={0}
                  type="button"
                  data-track={`tile-${w}`}
                >
                  {w}
                </button>
              );
            })}
          </div>
          {showTileWarning && (
            <button
              id="TileWarning"
              type="button"
              onClick={() => setShowTileWarning(false)}
              data-track="TileWarningBtn"
            >
              You can only select 5 keywords. Deselect one if you want to change it.
            </button>
          )}
        </div>
        <Form noValidate validated={validated} ref={form}>
          <div className="mb-5">
            <SectionTitle
              faIcon="flag"
              text="Find a Lead Investor"
              subText="If you don’t have a lead yet, start here"
            />
            <Form.Group
              controlId="LeadCheckBox"
              className="mb-4"
            >
              <Form.Check
                type="checkbox"
                label="Show only lead investors"
                checked={searchOnlyLeads}
                onChange={e => onOnlyLeadsChange(e.target.checked)}
                data-track="LeadCheckbox"
              />
            </Form.Group>
          </div>
          <div className="mb-5">
            <SectionTitle
              faIcon="rocket"
              text="Raising"
              detailText={usdFormatter.format(raiseValue)}
              subText="How much you're trying to raise ($100,000 - $10,000,000)"
            />
            <Form.Group controlId="RaiseInput">
              <Form.Label className="sr-only">
                The Amount Your Are Trying to Raise
              </Form.Label>
              <Form.Control
                required
                max={10000000}
                min={100000}
                type="number"
                placeholder="100000"
                value={raiseValue}
                isInvalid={validated && !raiseValid}
                onChange={e => onRaiseChange(e)}
                data-track="RaiseInput"
              />
              <Form.Control.Feedback type="invalid">
                Please enter a valid raise amount.
              </Form.Control.Feedback>
            </Form.Group>
          </div>
          <div className="mb-5">
            <SectionTitle
              faIcon="users"
              text="Investors From Diverse Backgrounds"
              subText="Only include investors on the Founders for Change Diverse Investors List"
              link="https://www.foundersforchange.org/diverse-investors-list"
            />
            <Form.Group
              controlId="DiverseCheckBox"
              className="mb-4"
            >
              <Form.Check
                type="checkbox"
                label="Must be on the Diverse Investors List"
                checked={searchOnlyDiverse}
                onChange={e => onOnlyDiverseChange(e.target.checked)}
                data-track="DiverseCheckbox"
              />
            </Form.Group>
          </div>
          <div className="mb-5">
            <SectionTitle
              faIcon="door-open"
              text="Open to Direct Outreach"
              subText="Show only investors that have indicated they are open to being contacted directly. We don't guarantee you can reach them."
            />
            <Form.Group
              controlId="OpenCheckBox"
              className="mb-4"
            >
              <Form.Check
                type="checkbox"
                label="Show only investors open to outreach"
                checked={searchOnlyOpen}
                onChange={e => onOnlyOpenChange(e.target.checked)}
                data-track="OpenCheckbox"
              />
            </Form.Group>
          </div>
          <SectionTitle
            faIcon="map-marker-alt"
            text="Location"
            subText="The Zip Code of your office or home"
          />
          <Form.Group controlId="LocationInput">
            <Form.Label className="sr-only">
              My Zip Code (5 digit)
            </Form.Label>
            <Form.Control
              maxLength={5}
              pattern="[0-9]{5}"
              type="text"
              placeholder="zip code"
              value={locationValue}
              onChange={e => onLocationChange(e)}
              isInvalid={validated && !locationValid}
              data-track="LocationInput"
            />
            <Form.Control.Feedback type="invalid">
              Please enter a valid zip code.
            </Form.Control.Feedback>
          </Form.Group>
          <div className={`mb-3 ${extraZipcodesClass}`}>
            {`Status: ${extraZipcodesText}`}
          </div>
          <Form.Group
            controlId="RemoteCheckbox"
            className="mb-5"
          >
            <Form.Check
              type="checkbox"
              label="We're fully remote."
              checked={storedRemote}
              onChange={e => onRemoteChange(e.target.checked)}
              data-track="RemoteCheckbox"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="searchBtn"
          type="button"
          onClick={closeAndSearch}
          data-track="SubmitSearch"
        >
          <FontAwesomeIcon icon="search" className="mr-2" />
          Search
        </button>
      </Modal.Footer>
    </Modal>
  );
}
