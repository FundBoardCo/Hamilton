import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Row from 'react-bootstrap/Row';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import PropTypes from 'prop-types';
import PersonPublic from '../../components/people/PersonPublic';
import * as types from '../../actions/types';
import DismissibleStatus from '../../components/DismissibleStatus';
import { STAGEPROPS } from '../../constants';
import { getSafeVar } from '../../utils';

export default function Public(props) {
  const { match } = props;
  const { params } = match;
  const { uuid } = params;

  const manageRaise = useSelector(state => state.manageRaise);
  const { getPublic_status, public_records = {}, publicUUID } = manageRaise;
  const isMyPage = uuid === publicUUID;
  const investorIDs = Object.keys(public_records);
  const people = useSelector(state => state.people);

  const [sortBy, setSortBy] = useState('status');
  const [searchBy, setSearchBy] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: types.PUBLIC_GET_BOARD_REQUESTED,
      uuid,
    });
  }, [uuid, dispatch]);

  useEffect(() => {
    const ids = Object.keys(public_records);
    if (ids.length) {
      dispatch({
        type: types.PEOPLE_GET_REQUEST,
        id: ids,
      });
    }
  }, [public_records, dispatch]);

  const investorList = [];
  let toShowInvestorList;

  investorIDs.forEach(i => {
    const person = people[i] ? { ...people[i] } : {};
    const investorStatus = public_records[i] || {};
    investorList.push({
      ...person,
      uuid: i,
      investorStatus,
    });
  });

  investorList.sort((a, b) => {
    if (sortBy === 'status') {
      const stageKeys = Object.keys(STAGEPROPS);
      const aStage = a.investorStatus.stage;
      const bStage = b.investorStatus.stage;
      return stageKeys.indexOf(aStage) > stageKeys.indexOf(bStage) ? 1 : -1;
    }
    return a.name > b.name ? 1 : -1;
  });

  if (searchBy) {
    toShowInvestorList = investorList.filter(i => {
      const org = getSafeVar(() => i.primary_organization.name, '');
      return i.name.toLowerCase().includes(searchBy.toLowerCase())
        || org.toLowerCase().includes(searchBy.toLowerCase());
    });
  } else {
    toShowInvestorList = investorList;
  }

  return (
    <Row id="PageBoard" className="pageContainer">
      <div>
        <div className="boardDetailsBar">
          <div className="primaryDetails">
            <span>
              {`My Fundboard: ${investorIDs.length}`}
              <span className="d-none d-md-inline">&nbsp;Potential Lead</span>
              <span className="d-none d-xs-inline">&nbsp;Investors</span>
            </span>
          </div>
        </div>
        {investorIDs.length > 0 && (
          <div className="d-flex justify-content-end justify-content-lg-end align-items-center mb-3">
            <div className="sortBar">
              <span className="label">Sort By:</span>
              <button
                type="button"
                className={sortBy === 'name' ? 'active' : ''}
                onClick={() => setSortBy('name')}
              >
                ABC
              </button>
              <button
                type="button"
                className={sortBy === 'status' ? 'active' : ''}
                onClick={() => setSortBy('status')}
              >
                Status
              </button>
            </div>
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
      <DismissibleStatus
        status={getPublic_status}
        showSuccess={false}
        dissmissAction={types.PUBLIC_GET_BOARD_DISMISSED}
      />
      <div className="results">
        {toShowInvestorList.map(i => {
          const personProps = {
            ...i,
            sortedBy: sortBy,
            founderID: uuid,
            isMyPage,
          };
          return (
            <PersonPublic key={i.uuid} {...personProps} />
          );
        })}
      </div>
      {investorIDs.length === 0 && (
        <div>
          This founder doesn’t have any investors saved yet.
        </div>
      )}
    </Row>
  );
}

Public.defaultProps = {
  match: {},
};

Public.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.objectOf(PropTypes
      .oneOfType([PropTypes.bool, PropTypes.string, PropTypes.objectOf(PropTypes.string)])),
  }),
};
