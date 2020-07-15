import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router';

export default function Location() {
  const searchKeywords = useSelector(state => state.search.keywords) || [];
  const searchRaise = useSelector(state => state.search.raise) || 100000;

  const searchLocation = useSelector(state => state.search.location) || '';
  const [locationValue, setLocationValue] = useState(searchLocation);

  const storedRemote = useSelector(state => state.search.remote) || '';
  const [remoteValue, setRemoteValue] = useState(storedRemote);

  const [validated, setValidated] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const dispatch = useDispatch();

  const history = useHistory();

  const setLocation = location => dispatch({
    type: 'SEARCH_SET_LOCATION',
    location,
  });

  const setRemote = remote => dispatch({
    type: 'SEARCH_SET_REMOTE',
    remote,
  });

  const getResults = () => {
    const params = {};
    params.location = searchLocation;
    params.raise = searchRaise;
    params.keywords = searchKeywords;
    return dispatch({
      type: 'SEARCH_GET_RESULTS_REQUESTED',
      params,
    });
  };

  const onLocationChange = e => {
    const form = e.currentTarget;
    const val = e.target.value;
    setValidated(true);
    if (form.checkValidity()) {
      setIsValid(true);
      setLocationValue(val);
      setLocation(val);
    } else {
      setLocationValue(val);
      setIsValid(false);
    }
  };

  const onRemoteChange = val => {
    setRemoteValue(val);
    setRemote(val);
  };

  const onSearchClick = () => {
    getResults();
    history.push('/search');
  };

  return (
    <Row id="Location">
      <Col className="locationInner">
        <h1 className="text-center">Near</h1>
        <p className="text-center">The location of your office, or home if you're remote.</p>
        <div className="formWrapper">
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
            <Button
              variant="secondary"
              className="btnNoMax"
              disabled={!searchLocation}
              onClick={onSearchClick}
            >
              See My Matches
            </Button>
          </Form>
        </div>
      </Col>
    </Row>
  );
}
