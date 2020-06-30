import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Logo from "../../imgs/FundBoard_Logo.svg";

export default function Intro() {
  return (
    <Row id="PageIntro" className="pageContainer flex-column flex-grow-1">
      <Col>
        <div className='d-flex flex-column justify-content-center align-items-center h100'>
          <img id="Logo" className="responsiveImg" src={Logo} alt="FundBoard Logo" />
          <h1>FundBoard</h1>
          <p className="text-center h4">It should be easier to find investors that want to fund your startup.</p>
          <p className="text-center h4">Now it is.</p>
        </div>
      </Col>
      <Col className="flex-grow-0">
        <div className='d-flex flex-column align-items-center'>
          <Button
            variant='secondary'
            className='btnResponsiveMax mb-2'
          >Build your FundBoard</Button>
          <p className="tx text-center">
            Are you ready to raise a round? Click the button above to get started. If not, you can <a>learn more about building and funding your startup here.</a>
          </p>
        </div>
      </Col>
    </Row>
  );
}
