import React, { useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function Location() {
  const storedLocation = useSelector(state => state.search.location) || '';
  const [locationValue, setLocationValue] = useState(storedLocation);

  const storedRemote = useSelector(state => state.search.remote) || '';
  const [remoteValue, setRemoteValue] = useState(storedRemote);

  const dispatch = useDispatch();

  const setLocation = location => dispatch({
    type: 'SEARCH_SET_LOCATION',
    location,
  });

  const setRemote = remote => dispatch({
    type: 'SEARCH_SET_REMOTE',
    remote,
  });

  const onLocationChange = val => {
    setLocationValue(val);
    setLocation(val);
  };

  const onRemoteChange = val => {
    setRemoteValue(val);
    setRemote(val);
  };

  return (
    <Row id="Location">
      <Col className="locationInner">
        <h1 className="text-center">Near</h1>
        <div className="formWrapper">
          <Form>
            <Form.Group controlId="LocationInput">
              <Form.Label>My Zip Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="zip code"
                onChange={e => onLocationChange(e.target.value)}
              />
            </Form.Group>
            <Form.Group
              controlId="RemoteCheckbox"
              className="mb-4"
            >
              <Form.Check
                type="checkbox"
                label="We're fully remote"
                onChange={e => onRemoteChange(e.target.checked)}
              />
            </Form.Group>
            <Button
              variant="secondary"
              className="btnResponsiveMax"
              disabled={!storedLocation}
            >
              See My Matches
            </Button>
          </Form>
        </div>
      </Col>
    </Row>
  );
}
