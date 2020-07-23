import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Person from '../../components/people/Person';

export default function Board() {
  const investors = useSelector(state => state.board.ids) || [];
  const people = useSelector(state => state.people);
  const investorList = {};
  investors.forEach(i => {
    investorList[i] = people[i];
  });

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

  return (
    <Row id="PageBoard" className="pageContainer">
      <div className="boardDetailsBar">
        <div className="primaryDetails">
          <Button
            className="primaryDetailsLink"
            variant="text-light"
            onClick={onDetailClick}
            data-track="BoardDetails"
          >
            {`My Fundboard: ${Object.keys(investors).length} investors`}
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
        </div>
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
