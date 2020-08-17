import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Papa from 'papaparse';
import FileSaver from 'file-saver';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Col from 'react-bootstrap/Col';
import Person from '../../components/people/Person';
import * as types from '../../actions/types';

export default function Board() {
  const investors = useSelector(state => state.board.ids) || [];
  const people = useSelector(state => state.people);
  const loggedIn = useSelector(state => state.user.loggedIn);
  const investorList = {};
  const csvList = [];

  const firstLine = {};
  firstLine['Investor Name'] = 'DELETE THIS ROW. It is just some helpful reminders.';
  firstLine.Title = '';
  firstLine.Organization = '';
  firstLine.Priority = 'Rank investors in the order you will reach out to them.';
  firstLine['Introed By'] = 'Fill in when someone has made an introduction.';
  firstLine['Date of Intro'] = '';
  firstLine.Status = 'Contacted, Meeting Scheduled, Pitched, Term Sheet, Signed, Funded';
  firstLine['Next Steps'] = 'If you need to do something, list it here.';
  firstLine.Notes = '';
  firstLine['Potential Lead'] = 'Focus on getting leads first.';
  firstLine['Open to Direct Outreach'] = 'This means they might respond if you send them an email.';
  firstLine.Location = 'Investors are more likely to invest in their location, or near other startups they have funded.';
  firstLine.LinkedIn = '';
  firstLine.Twitter = '';
  firstLine.CrunchBase = '';
  csvList.push(firstLine);

  investors.forEach(i => {
    investorList[i] = people[i];
    const csvPer = {};
    // TODO change this for API data
    csvPer['Investor Name'] = `${people[i]['first name']} ${people[i]['last name']}`;
    csvPer.Title = people[i].primary_job_title;
    csvPer.Organization = people[i].primary_organization.value;
    csvPer.Priority = '';
    csvPer['Introed By'] = '';
    csvPer['Date of Intro'] = '';
    csvPer.Status = '';
    csvPer['Next Steps'] = '';
    csvPer.Notes = '';
    csvPer['Potential Lead'] = people[i].isLead ? 'Yes' : '';
    csvPer['Open to Direct Outreach'] = people[i].isOpen ? 'Yes' : '';
    csvPer.Location = `${people[i].location_city}, ${people[i].location_status}`;
    csvPer.LinkedIn = people[i].linkedin;
    csvPer.Twitter = people[i].twitter;
    csvPer.CrunchBase = people[i].crunchbase;
    csvList.push(csvPer);
  });
  const csv = Papa.unparse(Object.values(csvList));
  const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

  const details = investors.reduce((ac, cv) => {
    const newVal = { ...ac };
    const {
      matches,
      isLead,
      isImpact,
      isOpen,
    } = investorList[cv];
    if (matches) {
      newVal.keywords += matches.keywords.length > 2 ? 1 : 0;
      newVal.raise += matches.raise ? 1 : 0;
      newVal.location += matches.location ? 1 : 0;
      newVal.leads += isLead ? 1 : 0;
      newVal.impact += isImpact ? 1 : 0;
      newVal.open += isOpen ? 1 : 0;
    }
    return newVal;
  }, {
    keywords: 0,
    raise: 0,
    location: 0,
    leads: 0,
    impact: 0,
    open: 0,
  });

  const [detailsOpen, setDetailsOpen] = useState(false);

  const onDetailClick = () => {
    setDetailsOpen(!detailsOpen);
  };

  const onCSVClick = () => {
    FileSaver.saveAs(csvData, 'MyFundBoard.csv');
  };

  const dispatch = useDispatch();

  const onShowLogin = () => dispatch({
    type: types.MODAL_SET_OPEN,
    modal: 'login',
  });

  const onShowNextClick = () => dispatch({
    type: types.MODAL_SET_OPEN,
    modal: 'afterDownload',
  });

  return (
    <Row id="PageBoard" className="pageContainer">
      {loggedIn && (
      <div className="boardDetailsBar">
        <div className="primaryDetails">
          <Button
            className="primaryDetailsLink"
            variant="text-light"
            onClick={onDetailClick}
            data-track="BoardDetails"
          >
            {`My Fundboard: ${Object.keys(investors).length} investors`}
            <div>
              <FontAwesomeIcon icon="file-download" />
              <span className="d-none d-lg-inline ml-2">Download</span>
            </div>
          </Button>
        </div>
        <div className={`secondaryDetails ${detailsOpen ? '' : 'sr-only'}`}>
          <div className="mb-2">
            <Button
              variant="link"
              className="w-100 w-lg-auto btnResponsiveMax"
              onClick={onShowNextClick}
            >
              <h3>
                <FontAwesomeIcon icon="info-circle" className="mr-2" />
                How do I use my FundBoard?
              </h3>
            </Button>
          </div>
          <p>
            <strong>{`More than 3 keywords match: ${details.keywords}`}</strong>
          </p>
          <p>
            <strong>{`Raise amount matches: ${details.raise}`}</strong>
          </p>
          <p>
            <strong>{`Invests in your location: ${details.location}`}</strong>
          </p>
          <p>
            <strong>{`Lead investors: ${details.leads}`}</strong>
          </p>
          <p>
            <strong>{`Open to direct outreach: ${details.open}`}</strong>
          </p>
          <p>
            <strong>{`Impact funds: ${details.impact}`}</strong>
          </p>
          <Button
            variant="primary"
            className="w-100 w-lg-auto btnResponsiveMax"
            onClick={onCSVClick}
          >
            <FontAwesomeIcon icon="file-download" className="mr-2" />
            Download (CSV)
          </Button>
        </div>
      </div>
      )}
      {loggedIn && (
      <div className="results">
        {Object.keys(investorList).map(k => {
          const personProps = { ...investorList[k] };
          personProps.uuid = k;
          personProps.isBoard = true;
          const pKey = personProps.permalink || personProps.image_id;
          return (
            <Person key={pKey} {...personProps} />
          );
        })}
      </div>
      )}
      {!loggedIn && (
        <Col xs={12} md={8} className="mr-auto ml-auto">
          <h1 className="text-center">To see your FundBoard, you need to log in first.</h1>
          <div className="d-flex justify-content-center">
            <Button
              variant="secondary"
              className="btnResponsiveMax"
              onClick={onShowLogin}
            >
              Login
            </Button>
          </div>
        </Col>
      )}
    </Row>
  );
}
