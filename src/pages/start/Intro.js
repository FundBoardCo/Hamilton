import React from 'react';
import Row from 'react-bootstrap/Row';
import Logo from '../../imgs/FundBoard_Logo.svg';

export default function Intro() {
  return (
    <Row id="PageIntro" className="pageContainer">
      <div className="introTop">
        <img id="Logo" className="responsiveImg" src={Logo} alt="FundBoard Logo" />
        <h1 className="mb-lg-2 h3 h-lg-1">FundBoard</h1>
        <p className="text-center h3 h-sm-4">Where Founders Manage Their Raise</p>
        <p className="text-center h5">Find lead investors and track your progress on your FundBoard</p>
      </div>
      <div className="introBottom">
        <a
          href="/introSearch"
          className="btn btn-secondary btnNoMax mb-3 mb-lg-4"
          data-track="IntroPageSearch"
        >
          Build your FundBoard
        </a>
        <p className="txSm tx-lg-tx text-center">
          <i>If you&apos;re not raising right now, you can stil prep with a Fundboard,</i>
          <br />
          <a
            href="https://fundboard.co"
            data-track="IntroPageLearn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i>or click here for more resources on building and funding startups.</i>
          </a>
        </p>
      </div>
    </Row>
  );
}
