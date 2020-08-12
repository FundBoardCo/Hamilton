import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router';
import * as types from '../../actions/types';
import { statusIsError } from '../../utils';

export default function Location() {
  const searchKeywords = useSelector(state => state.search.keywords) || [];
  const searchRaise = useSelector(state => state.search.raise) || 100000;

  const searchLocation = useSelector(state => state.search.location) || '';
  const [locationValue, setLocationValue] = useState('');

  const extraZipcodes = useSelector(state => state.search.extraZipcodes) || '';
  const extraZipcodes_status = useSelector(state => state.search.extraZipcodes_status);

  const storedRemote = useSelector(state => state.search.remote) || '';
  const [remoteValue, setRemoteValue] = useState(storedRemote);

  const [validated, setValidated] = useState(false);
  const [isValid, setIsValid] = useState(!!searchLocation);

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

  useEffect(() => {
    dispatch({
      type: 'SEARCH_SET_LOCATION',
      location: '',
    });
  }, [dispatch]);

  const getResults = () => {
    const params = {};
    params.location = [searchLocation, ...extraZipcodes];
    params.raise = searchRaise;
    params.keywords = searchKeywords;
    return dispatch({
      type: types.SEARCH_GET_RESULTS_REQUESTED,
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

  let extraZipcodesText = extraZipcodes_status;

  if (!searchLocation) extraZipcodesText = 'waiting for your zip code.';

  if (!extraZipcodes_status || extraZipcodes_status === 'succeeded') {
    extraZipcodesText = `${extraZipcodes.length} zip codes within 20 miles of ${searchLocation} found.`;
  }

  const extraZipcodesClass = statusIsError(extraZipcodes_status) ? 'text-warning' : 'text-info';

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
                data-track="IntroSearchZipCode"
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
                data-track="IntroSearchRemote"
              />
            </Form.Group>
            {searchLocation && (
              <div className={`mb-2 ${extraZipcodesClass}`}>
                {`Status: ${extraZipcodesText}`}
              </div>
            )}
            <Button
              variant="secondary"
              className="btnNoMax"
              disabled={!isValid || !searchLocation || extraZipcodes_status !== 'succeeded'}
              onClick={onSearchClick}
              data-track="IntroSearchSeeMatches"
            >
              See My Matches
            </Button>
          </Form>
        </div>
      </Col>
    </Row>
  );
}
