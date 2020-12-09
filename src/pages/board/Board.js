import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Papa from 'papaparse';
import FileSaver from 'file-saver';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Person from '../../components/people/Person';
import * as types from '../../actions/types';
import DismissibleStatus from '../../components/DismissibleStatus';
import { STAGEPROPS } from '../../constants';
import { getSafeVar } from '../../utils';

export default function Board() {
  const getBoardUUID_status = useSelector(state => state.manageRaise.getBoardUUID_status);
  const investorIDs = useSelector(state => state.user.investors) || [];
  const people = useSelector(state => state.people);
  const manualInvestorGet_status = useSelector(
    state => state.manageRaise.manualInvestorGet_status,
  );
  const manual_records = useSelector(state => state.manageRaise.manual_records) || {};
  const loggedIn = useSelector(state => state.user.token);
  const email = useSelector(state => state.user.email);
  const modalsSeen = useSelector(state => state.modal.modalsSeen) || [];
  const investorStatus_getStatus = useSelector(state => state.manageRaise.get_status);
  const investorStatus_records = useSelector(state => state.manageRaise.records);
  const boardNotFound = useSelector(state => state.manageRaise.notFound);
  const publicID = useSelector(state => state.manageRaise.publicUUID);

  const [sortBy, setSortBy] = useState('status');
  const [sortNameUp, setSortNameUp] = useState(false);
  const [sortStatusUp, setSortStatusUp] = useState(false);
  const [searchBy, setSearchBy] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: types.USER_GET_MANUALINVESTORS_REQUESTED,
      params: { email },
    });
  }, [email, dispatch]);

  useEffect(() => {
    dispatch({
      type: types.USER_GET_BOARDUUID_REQUESTED,
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: types.USER_GET_PROFILE_REQUESTED,
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({
      type: types.PUBLIC_GET_BOARD_REQUESTED,
      uuid: publicID,
    });
  }, [publicID, dispatch]);

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
      });
    }
  }, [investorIDs, dispatch]);

  let investorList = [];
  let toShowInvestorList;
  const csvList = [];

  const firstLine = {};
  firstLine['Investor Name'] = 'DELETE THIS ROW. These are just some helpful reminders.';
  firstLine.Title = '';
  firstLine.Organization = '';
  firstLine.Priority = 'Rank investors in the order you will reach out to them.';
  firstLine['Introed By'] = 'Fill in when someone has made an introduction.';
  firstLine['Introer Email'] = '';
  firstLine['Date of Intro'] = '';
  firstLine.Stage = Object.keys(STAGEPROPS).join(', ');
  firstLine.Amount = 'Amount they are investing';
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
    const investorStatus = investorStatus_records[i] || {};
    investorList.push({
      ...person,
      uuid: i,
      investorStatus,
    });
    const org = person.primary_organization || {};
    const location = [];
    if (person.location_city) location.push(person.location_city);
    if (person.location_state) location.push(person.location_state);
    const noteValues = investorStatus.notes ? Object.values(investorStatus.notes) : [];
    const notesForCSV = noteValues
      .filter(n => !n.next).map(n => `${n.text} ${n.date || ''}`).join(' || ');
    const nextForCSV = noteValues
      .filter(n => n.next).map(n => `${n.text} ${n.date || ''}`).join(' || ');
    const csvPer = {};
    csvPer['Investor Name'] = person.name || '';
    csvPer.Title = person.primary_job_title || '';
    csvPer.Organization = org.name || '';
    csvPer.Priority = '';
    csvPer['Introed By'] = investorStatus.intro_name || '';
    csvPer['Introer Email'] = investorStatus.intro_email || '';
    csvPer['Date of Intro'] = investorStatus.intro_date || '';
    csvPer.Stage = investorStatus.stage;
    csvPer.Amount = investorStatus.amount || '';
    csvPer['Next Steps'] = nextForCSV;
    csvPer.Notes = notesForCSV;
    csvPer['Potential Lead'] = person.is_lead_investor ? 'Yes' : '';
    csvPer['Open to Direct Outreach'] = person.is_open ? 'Yes' : '';
    csvPer.Location = location.join(', ');
    csvPer.LinkedIn = person.linkedin || '';
    csvPer.Twitter = person.twitter || '';
    csvPer.CrunchBase = person.permalink ? `https://www.crunchbase.com/person/${person.permalink}` : '';
    csvList.push(csvPer);
  });

  Object.keys(manual_records).forEach(k => {
    const investorStatus = investorStatus_records[k] || {};
    const r = manual_records[k];
    investorList.push({
      ...r,
      investorStatus,
    });
    const noteValues = investorStatus.notes ? Object.values(investorStatus.notes) : [];
    const notesForCSV = noteValues
      .filter(n => !n.next).map(n => `${n.text} ${n.date || ''}`).join(' || ');
    const nextForCSV = noteValues
      .filter(n => n.next).map(n => `${n.text} ${n.date || ''}`).join(' || ');
    const csvPer = {};
    csvPer['Investor Name'] = r.name || '';
    csvPer.Title = r.primary_job_title || '';
    csvPer.Organization = r.primary_organization_name || '';
    csvPer.Priority = '';
    csvPer['Introed By'] = investorStatus.intro_name || '';
    csvPer['Introer Email'] = investorStatus.intro_email || '';
    csvPer['Date of Intro'] = investorStatus.intro_date || '';
    csvPer.Stage = investorStatus.stage;
    csvPer.Amount = investorStatus.amount || '';
    csvPer['Next Steps'] = nextForCSV;
    csvPer.Notes = notesForCSV;
    csvPer['Potential Lead'] = r.is_lead_investor ? 'Yes' : '';
    csvPer['Open to Direct Outreach'] = '';
    csvPer.Location = r.location;
    csvPer.LinkedIn = r.linkedin || '';
    csvPer.Twitter = r.twitter || '';
    csvPer.CrunchBase = r.permalink ? `https://www.crunchbase.com/person/${r.permalink}` : '';
    csvList.push(csvPer);
  });

  if (!showArchived) {
    investorList = investorList.filter(i => i.investorStatus.stage !== 'archived');
  }

  investorList.sort((a, b) => {
    if (sortBy === 'status') {
      const stageKeys = Object.keys(STAGEPROPS);
      const aStage = a.investorStatus.stage;
      const bStage = b.investorStatus.stage;
      if (sortStatusUp) {
        return stageKeys.indexOf(aStage) > stageKeys.indexOf(bStage) ? -1 : 1;
      }
      return stageKeys.indexOf(aStage) > stageKeys.indexOf(bStage) ? 1 : -1;
    }
    if (sortNameUp) {
      return a.name > b.name ? -1 : 1;
    }
    return a.name > b.name ? 1 : -1;
  });

  if (sortBy === 'next') {
    investorList = investorList.filter(i => {
      let next = [];
      const { investorStatus } = i;
      const { notes } = investorStatus;
      if (notes && Object.values(notes).length) {
        next = Object.values(notes).filter(v => v.next);
      }
      return next.length;
    });
  }

  if (searchBy) {
    toShowInvestorList = investorList.filter(i => {
      const org = getSafeVar(() => i.primary_organization.name, '');
      return i.name.toLowerCase().includes(searchBy.toLowerCase())
      || org.toLowerCase().includes(searchBy.toLowerCase());
    });
  } else {
    toShowInvestorList = investorList;
  }

  const csv = Papa.unparse(Object.values(csvList));
  const csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

  const onCSVClick = useCallback(() => {
    FileSaver.saveAs(csvData, 'MyFundBoard.csv');
  }, [csvData]);

  const history = useHistory();

  const onBoardClick = () => {
    if (!publicID || boardNotFound) {
      dispatch({
        type: types.USER_POST_PUBLICBOARD_REQUESTED,
        params: {
          id: false,
          addInvestors: investorList.filter(i => !Object.keys(i.investorStatus).length),
          investorParams: {
            stage: 'added',
            published: true,
          },
        },
      });
      dispatch({
        type: types.MODAL_SET_OPEN,
        modal: 'creatingPublicBoard',
      });
    } else {
      history.push(`/public/${publicID}`);
    }
  };

  const onAddBoardClick = () => {
    dispatch({
      type: types.MODAL_SET_OPEN,
      modal: 'editInvestor',
    });
  };

  const showHowToIntro = useCallback(() => dispatch({
    type: types.MODAL_SET_OPEN,
    modal: 'howToIntro',
  }), [dispatch]);

  const toggleSortByName = () => {
    if (sortBy === 'name') {
      setSortNameUp(!sortNameUp);
    } else {
      setSortBy('name');
    }
  };

  const toggleSortByStatus = () => {
    if (sortBy === 'status') {
      setSortStatusUp(!sortStatusUp);
    } else {
      setSortBy('status');
    }
  };

  const toggleSortByNext = () => {
    if (sortBy === 'next') {
      setSortBy('name');
    } else {
      setSortBy('next');
    }
  };

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
                <span className="d-none d-xs-inline">&nbsp;Investors</span>
              </span>
              <Button
                className="ml-auto mr-2 primaryDetailsLink"
                variant="link"
                onClick={showHowToIntro}
                data-track="BoardGetFunded"
              >
                <span className="ml-2">Next</span>
                <span className="d-none d-sm-inline">&nbsp;Steps</span>
              </Button>
              <Button
                className="primaryDetailsLink"
                variant="link"
                onClick={onCSVClick}
                disabled={investorIDs.length === 0}
                data-track="BoardDownload"
              >
                <span className="ml-2">Download</span>
                <span className="d-none d-sm-inline">&nbsp;My Investors</span>
              </Button>
            </div>
          </div>
          {investorIDs.length > 0 && (
            <div className="d-flex justify-content-end justify-content-lg-end align-items-center mb-3">
              <div className="sortBar">
                <span className="label">Sort By:</span>
                <button
                  type="button"
                  className={sortBy === 'name' ? 'active' : ''}
                  onClick={toggleSortByName}
                >
                  ABC
                </button>
                <button
                  type="button"
                  className={sortBy === 'status' ? 'active' : ''}
                  onClick={toggleSortByStatus}
                >
                  Status
                </button>
                <button
                  type="button"
                  className={sortBy === 'next' ? 'active' : ''}
                  onClick={toggleSortByNext}
                >
                  Next
                </button>
                <button
                  type="button"
                  className={showArchived ? 'active' : ''}
                  onClick={() => setShowArchived(!showArchived)}
                >
                  Archived
                </button>
              </div>
              <Button
                variant={publicID ? 'outline-secondary' : 'secondary'}
                className="txs-3 mr-2"
                onClick={onBoardClick}
              >
                <span>
                  {publicID ? 'Public' : 'Share'}
                  &nbsp;
                </span>
                <span className="d-none d-sm-inline">Board</span>
              </Button>
              <div className="searchBar">
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>
                      Search
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    type="text"
                    value={searchBy}
                    onChange={e => setSearchBy(e.target.value)}
                    aria-label="Search for an investor by name or organization."
                  />
                </InputGroup>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="d-flex mb-3">
        <Button
          variant="link"
          onClick={onAddBoardClick}
        >
          Add an Investor Manually
        </Button>
      </div>
      <DismissibleStatus
        status={manualInvestorGet_status}
        showSuccess={false}
        dissmissAction={types.USER_GET_MANUALINVESTORS_DISMISSED}
      />
      <DismissibleStatus
        status={investorStatus_getStatus}
        showSuccess={false}
        dissmissAction={types.USER_GET_INVESTORSTATUSES_DISMISSED}
      />
      <DismissibleStatus
        status={getBoardUUID_status}
        showSuccess={false}
        dissmissAction={types.USER_GET_BOARDUUID_DISMISSED}
      />
      {loggedIn && (
        <div className="results">
          {toShowInvestorList.map(i => {
            const personProps = {
              ...i,
              isBoard: true,
              sortedBy: sortBy,
            };
            return (
              <Person key={i.uuid} {...personProps} />
            );
          })}
          {toShowInvestorList.length < 1 && sortBy === 'next' && (
            <div className="d-flex justify-content-center">
              None of your investors have next steps yet. Open one to add a next step.
            </div>
          )}
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
            You don’t have any investors saved yet.
          </p>
          <div className="d-flex justify-content-center">
            <a className="btn btn-secondary" href="/search/menu">Find My Investors</a>
          </div>
        </div>
      )}
    </Row>
  );
}
