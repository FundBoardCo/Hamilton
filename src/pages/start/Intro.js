import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Logo from "../../imgs/FundBoard_Logo.svg";

export default function Intro() {
  return (
    <Row id="PageIntro" className="pageContainer">
      <Container fluid>
        <Row>
          <Col>
            <img id="Logo" src={Logo} alt="FundBoard Logo" />
            <h1>FundBoard</h1>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
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
