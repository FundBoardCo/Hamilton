import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Logo from './imgs/FundBoard_Logo.svg';

export default function Search() {
  return (
    <Row className="pageContainer">
      <Container fluid>
        <Row>
          <Col>
            <h1>Intro Search</h1>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            placeholder for search
          </Col>
        </Row>
      </Container>
    </Row>
  );
}
