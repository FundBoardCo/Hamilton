import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Search() {
  const searchKeywords = useSelector(state => state.search.keywords) || [];
  const searchRaise = useSelector(state => state.search.raise) || 100000;
  const searchLocation = useSelector(state => state.search.location) || '';
  const searchResults = useSelector(state => state.search.results) || [];
  const searchState = useSelector(state => state.search.results_state) || '';
  console.log(searchResults)

  const usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <Row className="pageContainer">
      <Container fluid>
        <Row>
          <Col>
            <h1>Search</h1>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <p>placeholder for search</p>
            <p>
              {`You searched for: ${searchKeywords.join()}`}
            </p>
            <p>
              {`Raise: ${usdFormatter.format(searchRaise)}`}
            </p>
            <p>
              {`Location: ${searchLocation}`}
            </p>
            <p>
              {`Search state: ${searchState}`}
            </p>
            <p>
              {`Search result count: ${searchResults.length}`}
            </p>
          </Col>
        </Row>
      </Container>
    </Row>
  );
}
