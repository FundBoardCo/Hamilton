import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Board() {
  return (
    <Row id="pageContainer">
      <Container fluid>
        <Row>
          <Col>
            <h1>My FundBoard</h1>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            Placeholder for board
          </Col>
        </Row>
      </Container>
    </Row>
  );
}
