import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Papa from 'papaparse';
import FileSaver from 'file-saver';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Person from '../../components/people/Person';

export default function Board() {
  const investors = useSelector(state => state.board.ids) || [];
  const people = useSelector(state => state.people);
  const loggedIn = useSelector(state => state.user.token);
  const investorList = {};
  const csvList = [];
  investors.forEach(i => {
    investorList[i] = people[i];
    const csvPer = {};
    // TODO change this for API data
    csvPer['Investor Name'] = `${people[i]['first name']} ${people[i]['last name']}`;
    csvPer.Title = people[i].primary_job_title;
    csvPer.Priority = '';
    csvPer['Potential Lead'] = people[i].isLead ? 'Yes' : '';
    csvPer['Open to Direct Outreach'] = people[i].isOpen ? 'Yes' : '';
    csvPer.Organization = people[i].primary_organization;
    csvPer.Location = `${people[i].location_city}, ${people[i].location_state}`;
    csvPer.LinkedIn = people[i].linkedin;
    csvPer.Twitter = people[i].twitter;
    csvPer.CrunchBase = people[i].crunchbase;
    csvPer['Introed By'] = '';
    csvPer['Date of Intro'] = '';
    csvPer.Status = '';
    csvPer['Next Steps'] = '';
    csvPer.Notes = '';
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
            <FontAwesomeIcon icon="file-download" />
          </Button>
        </div>
        <div className={`secondaryDetails ${detailsOpen ? '' : 'sr-only'}`}>
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
        <h1>To see your FundBoard, you need to log in first.</h1>
      )}
    </Row>
  );
}
