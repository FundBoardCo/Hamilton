import React from 'react';
import Row from 'react-bootstrap/Row';
import Logo from "../../imgs/FundBoard_Logo.svg";

export default function Intro() {
  return (
    <Row id="PageIntro" className="pageContainer flex-column flex-grow-1">
      <div className='introTop'>
        <img id="Logo" className="responsiveImg" src={Logo} alt="FundBoard Logo" />
        <h1 className="mb-lg-2 h3 h-lg-1">FundBoard</h1>
        <p className="text-center h5 h-sm-4">It should be easier to find investors that want to fund your startup.</p>
        <p className="text-center h5 h-sm-4">Now it is.</p>
      </div>
      <div className='introBottom'>
        <a
          href="/introSearch"
          className='btn btn-secondary btnNoMax mb-3 mb-lg-4'
        >Build your FundBoard</a>
        <p className="txSm tx-lg-tx text-center">
          Are you ready to raise a round? Click the button above to get started.
        </p>
        <p className="txSm tx-lg-tx text-center">
          If not, you can <a>learn more about building and funding your startup here.</a>
        </p>
      </div>
    </Row>
  );
}
