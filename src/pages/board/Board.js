import React, {useEffect, useState} from 'react';
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
  const investorIds = useSelector(state => state.board.ids) || [];
  const people = useSelector(state => state.people);
  const loggedIn = useSelector(state => state.user.token);
  const showAdvice = useSelector(state => state.board.showAdvice);

  // TODO: this currently doesn't do anything, because none of the fetched people have match data
  investorIds.sort((a, b) => {
    const matchA = (people[a] && people[a].percentageMatch) || 0;
    const matchB = (people[b] && people[b].percentageMatch) || 0;
    return matchB - matchA;
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: types.USER_GET_PROFILE_REQUESTED,
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: types.PEOPLE_GET_REQUEST,
      id: investorIds,
    });
  }, [investorIds, dispatch]);

  const investorList = {};
  const csvList = [];

  const firstLine = {};
  firstLine['Investor Name'] = 'DELETE THIS ROW. These are just some helpful reminders.';
  firstLine.Title = '';
  firstLine.Organization = '';
  firstLine.Priority = 'Rank investors in the order you will reach out to them.';
  firstLine['Introed By'] = 'Fill in when someone has made an introduction.';
  firstLine['Date of Intro'] = '';
  firstLine.Status = 'Contacted, Meeting Scheduled, Pitched, Term Sheet, Signed, Funded';
  firstLine['Next Steps'] = 'If you need to do something, list it here.';
  firstLine.Notes = '';
  firstLine['Potential Lead'] = 'Focus on getting leads first.';
  firstLine['Open to Direct Outreach'] = 'Have they publicly said they will respond to unsolicited emails?';
  firstLine.Location = 'Some investors are more likely to invest near their location, or other startups they have funded.';
  firstLine.LinkedIn = '';
  firstLine.Twitter = '';
  firstLine.CrunchBase = '';
  csvList.push(firstLine);

  investorIds.forEach(i => {
    const person = people[i] ? { ...people[i] } : {};
    const org = person.primary_organization || {};
    const location = [];
    if (person.location_city) location.push(person.location_city);
    if (person.location_state) location.push(person.location_state);
    investorList[i] = { ...person };
    const csvPer = {};
    // TODO change this for API data
    csvPer['Investor Name'] = person.name || '';
    csvPer.Title = person.primary_job_title || '';
    csvPer.Organization = org.name || '';
    csvPer.Priority = '';
    csvPer['Introed By'] = '';
    csvPer['Date of Intro'] = '';
    csvPer.Status = '';
    csvPer['Next Steps'] = '';
    csvPer.Notes = '';
    csvPer['Potential Lead'] = person.is_lead_investor ? 'Yes' : '';
    csvPer['Open to Direct Outreach'] = person.is_open ? 'Yes' : '';
    csvPer.Location = location.join(', ');
    csvPer.LinkedIn = person.linkedin || '';
    csvPer.Twitter = person.twitter || '';
    csvPer.CrunchBase = person.permalink ? `https://www.crunchbase.com/person/${person.permalink}` : '';
    csvList.push(csvPer);
  });

  const csv = Papa.unparse(Object.values(csvList));
  const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

  const details = investorIds.reduce((ac, cv) => {
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

  const onShowNextClick = () => dispatch({
    type: types.MODAL_SET_OPEN,
    modal: 'afterDownload',
  });

  const onToggleShowAdvice = () => dispatch({
    type: types.BOARD_SHOWADVICE,
    showAdvice: !showAdvice,
  });

  return (
    <Row id="PageBoard" className="pageContainer">
      {loggedIn && (
        <div>
          <div className="boardDetailsBar">
            <div className="primaryDetails">
              {`My Fundboard: ${investorIds.length} investors`}
            </div>
          </div>
          <div className="d-flex justify-content-around justify-content-lg-end mb-2">
            <Button
              className="primaryDetailsLink txs-2 txs-lg-tx3 mr-2 btnNoMax"
              variant="primary"
              onClick={onToggleShowAdvice}
              data-track="BoardGetFunded"
            >
              <FontAwesomeIcon icon="comment" />
              <span className="ml-2">Get Intros and Get Funded</span>
            </Button>
            <Button
              className="primaryDetailsLink txs-2 txs-lg-tx3"
              variant="secondary"
              onClick={onCSVClick}
              disabled={investorIds.length === 0}
              data-track="BoardDownload"
            >
              <FontAwesomeIcon icon="file-download" />
              <span className="ml-2">Download CSV</span>
            </Button>
          </div>
          <div className="mb-3 txs-2 tx-md-tx3">
            {showAdvice && (
              <div>
                <p>
                  Use the information available for each investor on your FundBoard to find&nbsp;
                  someone that can introduce you to them, or try to reach them directly.
                </p>
                <p>
                  Track your progress by&nbsp;
                  <Button
                    className="inlineBtn"
                    variant="link"
                    onClick={onCSVClick}
                    data-track="BoardDownloadText"
                  >
                    downloading this CSV,
                  </Button>
                  and saving it locally, or to a shareable platform like Google Sheets.
                </p>
                <p>
                  You should have 20 or more potential leads. If you need more, try adjusting&nbsp;
                  the parameters in your&nbsp;
                  <a href="/search">search.</a>
                </p>
                <p>
                  Want more?&nbsp;
                  <a
                    href="https://www.fundboard.co/our-take/how-to-raise-with-your-fundboard"
                    target="_blank"
                    rel="noreferrer"
                  >
                    We&apos;ve written a detailed guide to raising funds with your FundBoard.
                  </a>
                </p>
              </div>
            )}
            <div className="d-flex">
              {showAdvice && (
                <Button
                  variant="link"
                  className="ml-auto"
                  onClick={onToggleShowAdvice}
                >
                  Hide
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
      {loggedIn && (
        <div className="results">
          {Object.keys(investorList).map(k => {
            const personProps = { ...investorList[k] };
            personProps.uuid = k;
            personProps.isBoard = true;
            return (
              <Person key={k} {...personProps} />
            );
          })}
        </div>
      )}
      {!loggedIn && (
        <Col xs={12} md={8} className="mr-auto ml-auto">
          <h1 className="text-center">To see your FundBoard, you need to log in first.</h1>
        </Col>
      )}
    </Row>
  );
}
