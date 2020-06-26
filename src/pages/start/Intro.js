import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export default function Intro() {
  return (
    <Row id="pageContainer">
      <Container fluid>
        <Row>
          <Col>
            <h1>FundBoard</h1>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Button
              variant='text'
              >
              Log In
            </Button>
            <p>It should be easier to find investors that want to fund your startup.</p>
            <p>Now it is.</p>
            <Button
              variant='primary'
              className='mb-2'
            >Build your FundBoard</Button>
            <p>
              Are you ready to raise a round? Click the button above to get started. If not, you can <a>learn more about building and funding your startup here.</a>
            </p>
          </Col>
        </Row>
      </Container>
    </Row>
  );
}
