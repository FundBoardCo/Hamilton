import React from 'react';
import { useSelector } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function NotFound() {
  const loggedIn = useSelector(state => state.user.sessionToken);

  return (
    <Row className="pageContainer">
      <Container fluid>
        <Row>
          <Col>
            <h1 className="text-center">Whoops</h1>
            <p className="text-center">
              There doesn&apos;t seem to be a page at this link.
            </p>
            <p className="text-center">
              <a href="/">Go to the index page.</a>
            </p>
            {loggedIn && (
              <p className="text-center">
                <a href="/board">Go to your FundBoard.</a>
              </p>
            )}
          </Col>
        </Row>
      </Container>
    </Row>
  );
}
