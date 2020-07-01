import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { INTROSEARCH_STAGES } from '../../constants';

export default function Search() {
  const [stage, setStage] = useState(0);
  const keywords = useSelector(state => state.search.keywords);
  const raise = useSelector(state => state.search.raise);
  const location = useSelector(state => state.search.location);
  console.log(stage)
  console.log(INTROSEARCH_STAGES.length)

  const onClickPrev = () => {
    if (stage > 0) setStage(stage -1);
  };

  const onClickNext = () => {
    if (stage < INTROSEARCH_STAGES.length -1) setStage(stage + 1);
  };

  return (
    <Row id="PageIntroSearch" className="pageContainer flex-column flex-grow-1">
      <div>
        search stuff here
      </div>
      <Navbar className="nav">
        <Nav>
          <a
            className="nav-link"
            onClick={onClickPrev}
            aria-disabled={stage === 0}
          >
            <FontAwesomeIcon icon="caret-left"/>
            {stage !== 0 &&
              <span>Back to {INTROSEARCH_STAGES[stage - 1]}</span>
            }
          </a>
          <div>
            Step {stage + 1} of {INTROSEARCH_STAGES.length}
          </div>
          <a
            className="nav-link"
            onClick={onClickNext}
            aria-disabled={stage >= INTROSEARCH_STAGES.length -1}
          >
            {stage < INTROSEARCH_STAGES.length - 1 &&
              <span>Forward to {INTROSEARCH_STAGES[stage + 1]}</span>
            }
            <FontAwesomeIcon icon="caret-right"/>
          </a>
        </Nav>
      </Navbar>
    </Row>
  );
}
