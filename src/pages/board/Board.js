import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Person from '../../components/people/Person';

export default function Board() {
  const investors = useSelector(state => state.board.ids) || [];
  const people = useSelector(state => state.people);
  const investorList = {};
  investors.forEach(i => {
    investorList[i] = people[i];
  });

  const [detailsOpen, setDetailsOpen] = useState(false);

  const onDetailClick = () => {
    setDetailsOpen(!detailsOpen);
  };

  return (
    <Row id="PageBoard" className="pageContainer">
      <div className="boardDetailsBar">
        <div className="primaryDetails">
          <Button
            className="primaryDetailsLink"
            variant="text-light"
            onClick={onDetailClick}
          >
            {`My Fundboard: ${Object.keys(investors).length} investors`}
          </Button>
        </div>
        {detailsOpen && (
          <div className="secondaryDetails">
            <p>
            </p>
          </div>
        )}
      </div>
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
    </Row>
  );
}
