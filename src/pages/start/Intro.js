import React from 'react';
import Row from 'react-bootstrap/Row';
import Logo from '../../imgs/FundBoard_Logo.svg';

export default function Intro() {
  return (
    <Row id="PageIntro" className="pageContainer">
      <div className="introTop mt-5 mt-lg-4 mb-4">
        <img
          id="Logo"
          className="responsiveImg mb-3"
          src={Logo}
          alt="FundBoard Logo"
        />
        <h1 className="mb-2 mb-lg-1 h2 h-lg-1">FundBoard</h1>
        <p className="text-center h5 unbold h-lg-3">Where Founders Manage Their Raise</p>
      </div>
      <div className="introBottom">
        <a
          href="/introSearch"
          className="btn btn-secondary btnNoMax mb-3 mb-lg-5"
          data-track="IntroPageSearch"
        >
          Find Your Investors
        </a>
      </div>
    </Row>
  );
}
