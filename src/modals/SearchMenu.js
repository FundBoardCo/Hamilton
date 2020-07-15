import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default function SearchMenu() {
  const airtableKeywords = useSelector(state => state.airtable.keywords) || {};

  const searchKeywords = useSelector(state => state.search.keywords) || [];
  const [keywordsValue, setKeywordsValue] = useState(searchKeywords);

  const searchRaise = useSelector(state => state.search.raise) || 100000;
  const [raiseValue, setRaiseValue] = useState(searchRaise);

  const searchLocation = useSelector(state => state.search.location) || '';
  const [locationValue, setLocationValue] = useState(searchLocation);

  const storedRemote = useSelector(state => state.search.remote) || '';
  const [remoteValue, setRemoteValue] = useState(storedRemote);

  const [validated, setValidated] = useState(false);
  const [isValid, setIsValid] = useState(false);

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

  const onRemoteChange = val => {
    setRemoteValue(val);
  };

  const getResults = () => {
    const params = {};
    params.keywords = keywordsValue;
    params.raise = raiseValue;
    params.location = locationValue;

    return dispatch({
      type: 'SEARCH_GET_RESULTS_REQUESTED',
      params,
    });
  };

  const closeModal = () => {
    setKeywords(keywordsValue);
    setRaise(raiseValue);
    setLocation(locationValue);
    setRemote(remoteValue);
    getResults();
    history.goBack();
  };

  useEffect(() => {
    if (!Array.isArray(airtableKeywords.data) && !airtableKeywords.state) getKeywords();
  });

  return (
    <Modal
      size="lg"
      aria-labelledby="Modal-Title"
      centered
      show
      scrollable
      onHide={closeModal}
      className="modal-sidebar-left"
    >
      <Modal.Header closeButton>
        <Modal.Title className="sr-only">
          Search Settings
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated}>
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
            />
            <Form.Control.Feedback type="invalid">
              Please enter a valid zip code.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group
            controlId="RemoteCheckbox"
            className="mb-4"
          >
            <Form.Check
              type="checkbox"
              label="We're fully remote, but I still entered my zip code."
              checked={remoteValue}
              onChange={e => onRemoteChange(e.target.checked)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
