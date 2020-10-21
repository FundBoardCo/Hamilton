import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as types from '../../actions/types';
import { STAGEPROPS } from '../../constants';
import StageIcon from './StageIcon';

function Stage(props) {
  const { stage, current, onClick } = props;
  return (
    <button
      className={`stage ${current && 'current'}`}
      onClick={() => onClick()}
      type="button"
    >
      <StageIcon current={current} stage={stage} />
      <div className="stageText">
        {STAGEPROPS[stage].text}
      </div>
    </button>
  );
}

export default function SelectInvestorStage(props) {
  const { uuid } = props;

  const investorIDs = useSelector(state => state.board.ids) || [];
  const investorStatus = useSelector(state => state.manageRaise.records[uuid]) || {};
  const investorStatuses = useSelector(state => state.manageRaise.records);
  console.log(investorStatuses)
  console.log(investorStatus)

  const { id } = investorStatus;
  let { stage } = investorStatus;

  if (!stage) {
    if (investorIDs.includes(uuid)) {
      stage = 'added';
    } else {
      stage = 'none';
    }
  }

  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const updateStatus = params => dispatch({
    type: types.USER_POST_INVESTORSTATUS_REQUESTED,
    params,
  });

  const onSelected = newStage => {
    const params = {
      id,
      stage: newStage,
      uuid,
    };
    updateStatus(params);
  };

  return (
    <div className="selectInvestorStage">
      <Stage stage={stage} current onClick={() => setOpen(!open)} />
      <div className={`${!open ? 'sr-only' : ''}`}>
        {Object.keys(STAGEPROPS).map(k => {
          if (k !== stage && k !== 'none' && k !== 'added') {
            return (
              <Stage
                stage={k}
                current={k === stage}
                key={k}
                onClick={() => onSelected(k)}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

SelectInvestorStage.defaultProps = {
  uuid: '',
};

SelectInvestorStage.propTypes = {
  uuid: PropTypes.string,
};

Stage.defaultProps = {
  stage: '',
  current: false,
  onClick: {},
};

Stage.propTypes = {
  stage: PropTypes.string,
  current: PropTypes.bool,
  onClick: PropTypes.func,
};
