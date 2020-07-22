import React, { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { INTROSEARCH_STAGES } from '../../constants';
import Keywords from './Keywords';
import Raise from './Raise';
import Location from './Location';

export default function Search() {
  const [stage, setStage] = useState(0);

  const onClickPrev = () => {
    if (stage > 0) setStage(stage -1);
  };

  const onClickNext = () => {
    if (stage < INTROSEARCH_STAGES.length - 1) setStage(stage + 1);
  };

  return (
    <div id="PageIntroSearch" className="pageContainer">
      {INTROSEARCH_STAGES[stage] === 'keywords' && <Keywords />}
      {INTROSEARCH_STAGES[stage] === 'raise' && <Raise />}
      {INTROSEARCH_STAGES[stage] === 'location' && <Location />}
      <Navbar className="nav">
        <Nav>
          <button
            className="nav-link"
            onClick={onClickPrev}
            aria-disabled={stage === 0}
            type="button"
          >
            <FontAwesomeIcon icon="caret-left" />
            {stage !== 0 && (
              <span>
                {`Back to ${INTROSEARCH_STAGES[stage - 1]}`}
              </span>
            )}
          </button>
          <div>
            {`Step ${stage + 1} of ${INTROSEARCH_STAGES.length}`}
          </div>
          <button
            className="nav-link"
            onClick={onClickNext}
            aria-disabled={stage >= INTROSEARCH_STAGES.length - 1}
            type="button"
          >
            {stage < INTROSEARCH_STAGES.length - 1 && (
              <span>
                {`Forward to ${INTROSEARCH_STAGES[stage + 1]}`}
              </span>
            )}
            <FontAwesomeIcon icon="caret-right" />
          </button>
        </Nav>
      </Navbar>
    </div>
  );
}
