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
import { MINPLACE, STAGEPROPS } from '../../constants';
import { getSafeVar } from '../../utils';
import GenericModal from '../../modals/GenericModal';

export default function Board() {
  const userUpdateStatus = useSelector(state => state.user.update_status);
  const people = useSelector(state => state.people.records);
  const getOwnInvestorsStatus = useSelector(
    state => state.investors.getOwnInvestors_status,
  );
  const ownInvestors = useSelector(state => state.investors.ownInvestors) || {};
  const loggedIn = useSelector(state => state.user.sessionToken);
  const place = useSelector(state => state.user.place);
  const allowIn = loggedIn && typeof place === 'number' && place <= MINPLACE;
  const modalsSeen = useSelector(state => state.modal.modalsSeen) || [];
  const publicUUID = useSelector(state => state.user.uuid);
  const boardPublicViewed = useSelector(state => state.user.board_public_viewed);

  const [sortBy, setSortBy] = useState('status');
  const [sortNameUp, setSortNameUp] = useState(false);
  const [sortStatusUp, setSortStatusUp] = useState(false);
  const [searchBy, setSearchBy] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: types.USER_GET_PROFILE_REQUESTED,
    });
  }, [dispatch]);

  useEffect(() => {
    const ids = Object.keys(ownInvestors);
    if (ids.length) {
      dispatch({
        type: types.PEOPLE_GET_REQUEST,
        ids,
      });
    }
  }, [ownInvestors, dispatch]);

  useEffect(() => {
    dispatch({
      type: types.USER_GET_INVESTORS_REQUESTED,
    });
  }, [dispatch]);

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

  Object.keys(ownInvestors).forEach(i => {
    const person = people[i] ? { ...people[i] } : {};
    const investorStatus = ownInvestors[i] || {};
    investorList.push({
      ...person,
      uuid: i,
      ...investorStatus, // merges in manual data
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
    const aName = (a.name && a.name.toLowerCase()) || '';
    const bName = (b.name && b.name.toLowerCase()) || '';
    if (sortNameUp) {
      return aName > bName ? -1 : 1;
    }
    return aName > bName ? 1 : -1;
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

  const onBoardOpenClick = () => {
    dispatch({
      type: types.USER_UPDATE_REQUESTED,
      params: { board_public_viewed: true },
    });
    history.push(`/public/${publicUUID}`);
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

  const shareYourBoardProps = {
    title: 'Share Your Public FundBoard',
    text: `You can share your public FundBoard with contacts that can introduce you to the investors
on it at ${window.location.origin}/public/${publicUUID}.`,
    buttons: [
      {
        key: 'public',
        text: 'Open Public FundBoard',
        variant: 'link',
        onClick: onBoardOpenClick,
      },
    ],
  };

  return (
    <Row id="PageBoard" className="pageContainer">
      {!boardPublicViewed && <GenericModal {...shareYourBoardProps} />}
      {allowIn && (
        <div>
          <div className="boardDetailsBar">
            <div className="primaryDetails">
              <span>
                My FundBoard
              </span>
              <Button
                className="primaryDetailsLink"
                variant="link"
                onClick={onCSVClick}
                disabled={Object.keys(ownInvestors).length === 0}
                data-track="BoardDownload"
              >
                <span className="ml-2">Download</span>
                <span className="d-none d-sm-inline">&nbsp;My Investors</span>
              </Button>
            </div>
          </div>
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
                To Do Next
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
              variant="link"
              className="txs-3 mr-2"
              onClick={onBoardOpenClick}
            >
              <span>
                Public FundBoard
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
        </div>
      )}
      <DismissibleStatus
        status={userUpdateStatus}
        showSuccess={false}
        dissmissAction={types.USER_UPDATE_DISSMISSED}
      />
      {allowIn && (
        <div className="d-flex mb-3">
          <Button
            variant="link"
            onClick={onAddBoardClick}
          >
            Add an Investor Manually
          </Button>
        </div>
      )}
      <DismissibleStatus
        status={getOwnInvestorsStatus}
        showSuccess={false}
        dissmissAction={types.USER_GET_INVESTORS_DISMISSED}
      />
      {allowIn && (
        <div className="results">
          {toShowInvestorList.map(i => {
            const personProps = {
              ...i,
              ...i.investorStatus,
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
      {allowIn && Object.keys(ownInvestors).length === 0 && (
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
