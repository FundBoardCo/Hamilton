import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Papa from 'papaparse';
import FileSaver from 'file-saver';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Col from 'react-bootstrap/Col';
import Person from '../../components/people/Person';
import * as types from '../../actions/types';
import DismissibleStatus from '../../components/DismissibleStatus';

export default function Board() {
  const investorIDs = useSelector(state => state.board.ids) || [];
  const people = useSelector(state => state.people);
  const loggedIn = useSelector(state => state.user.token);
  const modalsSeen = useSelector(state => state.modal.modalsSeen) || [];
  const investorStatus_getStatus = useSelector(state => state.manageRaise.get_status);
  const investorStatus_records = useSelector(state => state.manageRaise.records);
  console.log(investorStatus_records)

  // TODO: this currently doesn't do anything, because none of the fetched people have match data
  investorIDs.sort((a, b) => {
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
    if (investorIDs.length) {
      dispatch({
        type: types.PEOPLE_GET_REQUEST,
        id: investorIDs,
      });
    }
  }, [investorIDs, dispatch]);

  useEffect(() => {
    if (investorIDs.length) {
      dispatch({
        type: types.USER_GET_INVESTORSTATUSES_REQUESTED,
        ids: investorIDs,
      });
    }
  }, [investorIDs, dispatch]);

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

  investorIDs.forEach(i => {
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

  const onCSVClick = useCallback(() => {
    FileSaver.saveAs(csvData, 'MyFundBoard.csv');
  }, [csvData]);

  const showHowToIntro = useCallback(() => dispatch({
    type: types.MODAL_SET_OPEN,
    modal: 'howToIntro',
    actions: { onCSVClick },
  }), [dispatch, onCSVClick]);

  useEffect(() => {
    // if the how to intro modal has never been opened, open it
    // ToDo save to the server so it's maintained across browsers and devices.
    if (!modalsSeen.includes('howToIntro')) {
      showHowToIntro();
    }
  }, [showHowToIntro, modalsSeen]);

  return (
    <Row id="PageBoard" className="pageContainer">
      {loggedIn && (
        <div>
          <div className="boardDetailsBar">
            <div className="primaryDetails">
              <span>
                {`My Fundboard: ${investorIDs.length}`}
                <span className="d-none d-md-inline">&nbsp;Potential Lead</span>
                &nbsp;Investors
              </span>
            </div>
          </div>
          {investorIDs.length > 0 && (
            <div className="d-flex justify-content-end justify-content-lg-end mb-3">
              <Button
                className="primaryDetailsLink txs-2 txs-lg-tx3 mr-2 btnNoMax"
                variant="primary"
                onClick={showHowToIntro}
                data-track="BoardGetFunded"
              >
                <FontAwesomeIcon icon="question" />
                <span className="ml-2">Next</span>
                <span className="d-none d-sm-inline">&nbsp;Steps</span>
              </Button>
              <Button
                className="primaryDetailsLink txs-2 txs-lg-tx3"
                variant="secondary"
                onClick={onCSVClick}
                disabled={investorIDs.length === 0}
                data-track="BoardDownload"
              >
                <FontAwesomeIcon icon="file-download" />
                <span className="ml-2">Download</span>
                <span className="d-none d-sm-inline">&nbsp;My Investors</span>
              </Button>
            </div>
          )}
        </div>
      )}
      <DismissibleStatus
        status={investorStatus_getStatus}
        showSuccess={false}
        dissmissAction={types.USER_GET_INVESTORSTATUSES_DISMISSED}
      />
      {loggedIn && (
        <div className="results">
          {Object.keys(investorList).map(k => {
            const personProps = { ...investorList[k] };
            personProps.uuid = k;
            personProps.isBoard = true;
            personProps.investorStatus = investorStatus_records[k];
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
      {investorIDs.length === 0 && (
        <div>
          <p>
            You don't have any investors saved yet.
          </p>
          <div className="d-flex justify-content-center">
            <a className="btn btn-secondary" href="/search/menu">Find My Investors</a>
          </div>
        </div>
      )}
    </Row>
  );
}
