import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import SelectSearch from 'react-select-search';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import RangeSlider from 'react-bootstrap-range-slider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from 'react-bootstrap/Button';
import { statusIsError } from '../utils';

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
        <p>{subText}</p>
      )}
    </div>
  );
}

export default function SearchMenu() {
  const airtableKeywords = useSelector(state => state.airtable.keywords) || {};
  let wordsToShow = Array.isArray(airtableKeywords.data) ? airtableKeywords.data : [];
  wordsToShow = wordsToShow.map(w => ({ name: w, value: w }));

  const searchKeywords = useSelector(state => state.search.keywords) || [];

  const searchRaise = useSelector(state => state.search.raise) || 100000;

  const searchLocation = useSelector(state => state.search.location) || '';
  // use local state to handle invalid entries without recording them
  const [locationValue, setLocationValue] = useState(searchLocation);

  const extraZipcodes = useSelector(state => state.search.extraZipcodes) || '';
  const extraZipcodes_status = useSelector(state => state.search.extraZipcodes_status);

  const storedRemote = useSelector(state => state.search.remote) || '';

  const [validated, setValidated] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const [showTileWarning, setShowTileWarning] = useState(false);

  const dispatch = useDispatch();

  const history = useHistory();

  const getKeywords = () => dispatch({
    type: 'AIRTABLE_GET_KEYWORDS_REQUESTED',
  });

  const setKeywords = keywords => dispatch({
    type: 'SEARCH_SET_KEYWORDS',
    keywords,
  });

  const setRaise = raise => dispatch({
    type: 'SEARCH_SET_RAISE',
    raise,
  });

  const setLocation = location => dispatch({
    type: 'SEARCH_SET_LOCATION',
    location,
  });

  const setRemote = remote => dispatch({
    type: 'SEARCH_SET_REMOTE',
    remote,
  });

  const onSelectChange = v => {
    console.log(v);
    if (v.length < 6) {
      setKeywords(v);
      setShowTileWarning(false);
    }
    if (v.length > 5) {
      setShowTileWarning(true);
    }
  };

  const onTileClick = (word, active) => {
    if (active) {
      setKeywords(searchKeywords.filter(w => w !== word));
      setShowTileWarning(false);
    } else if (searchKeywords.length < 5) {
      setKeywords([...searchKeywords, word]);
      setShowTileWarning(false);
    } else {
      setShowTileWarning(true);
    }
  };

  const onRaiseChange = val => {
    setRaise(val);
  };

  const onRemoteChange = val => {
    setRemote(val);
  };

  const onLocationChange = e => {
    const input = e.currentTarget;
    const val = e.target.value;
    setValidated(true);
    if (input.checkValidity()) {
      setIsValid(true);
      setLocationValue(val);
      setLocation(val);
    } else {
      setLocationValue(val);
      setIsValid(false);
    }
  };

  const getResults = () => {
    const params = {};
    params.keywords = searchKeywords;
    params.raise = searchRaise;
    params.location = [searchLocation, ...extraZipcodes];

    return dispatch({
      type: 'SEARCH_GET_RESULTS_REQUESTED',
      params,
    });
  };

  const resetSearch = () => {
    setKeywords([]);
    setRaise(100000);
    setLocation('');

    return dispatch({
      type: 'SEARCH_CLEAR_RESULTS',
    });
  };

  const closeModal = () => {
    history.goBack();
  };

  const closeAndSearch = () => {
    getResults();
    history.goBack();
  };

  useEffect(() => {
    if (!Array.isArray(airtableKeywords.data) && !airtableKeywords.state) getKeywords();
  });

  let extraZipcodesText = extraZipcodes_status;

  if (!searchLocation) extraZipcodesText = 'waiting for your zip code.';

  if (!extraZipcodes_status || extraZipcodes_status === 'succeeded') {
    extraZipcodesText = `${extraZipcodes.length} zip codes within 20 miles of ${searchLocation} found.`;
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
          text="My Keywords"
          faIcon="key"
          detailText={`${searchKeywords.length} selected`}
          subText="Choose up to 5 words that describe your startup"
        />
        <div className="txs-2 text-info mb-2">
          Selected:&nbsp;
          {searchKeywords.join()}
        </div>
        <div className="mb-4">
          <SelectSearch
            options={wordsToShow}
            value={searchKeywords}
            name="keywords"
            placeholder="Choose up to 5 keywords"
            multiple
            search
            autoComplete="on"
            printOptions="always"
            onChange={onSelectChange}
            closeOnSelect={false}
          />
        </div>
        <div>
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
        <SectionTitle
          faIcon="rocket"
          text="Raising"
          detailText={usdFormatter.format(searchRaise)}
          subText="The amount you're trying to raise this round"
        />
        <div className="sliderWrapper">
          <div className="sliderMin">
            {usdFormatter.format(100000)}
          </div>
          <RangeSlider
            value={searchRaise}
            min={100000}
            max={10000000}
            step={100000}
            size="lg"
            variant="primary"
            tooltip="on"
            tooltipLabel={val => usdFormatter.format(val)}
            onChange={e => onRaiseChange(Number(e.target.value))}
            data-track="RaiseSlider"
          />
          <div className="sliderMax">
            {usdFormatter.format(10000000)}
          </div>
        </div>
        <Form noValidate validated={validated}>
          <SectionTitle
            faIcon="map-marker-alt"
            text="Location"
            subText="The Zip Code of your office or home"
          />
          <Form.Group controlId="LocationInput">
            <Form.Label>My Zip Code (5 digit)</Form.Label>
            <Form.Control
              required
              maxLength={5}
              pattern="[0-9]{5}"
              type="text"
              placeholder="zip code"
              value={locationValue}
              onChange={e => onLocationChange(e)}
              isInvalid={validated && !isValid}
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
            className="mb-4"
          >
            <Form.Check
              type="checkbox"
              label="We're fully remote, but I still entered my zip code."
              checked={storedRemote}
              onChange={e => onRemoteChange(e.target.checked)}
              data-track="RemoteCheckbox"
            />
          </Form.Group>
        </Form>
        <div className="d-flex justify-content-end mt-auto">
          <Button
            variant="link"
            className="text-danger"
            onClick={resetSearch}
            data-track="ResetSearch"
          >
            <FontAwesomeIcon icon="exclamation-triangle" className="mr-2" />
            Reset Search
          </Button>
        </div>
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
