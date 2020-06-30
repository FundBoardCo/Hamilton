import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Profile() {
  return (
    <Row className="pageContainer">
      <Container fluid>
        <Row>
          <Col>
            <h1>My FundBoard</h1>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            Placeholder for profile
          </Col>
        </Row>
      </Container>
    </Row>
  );
}
