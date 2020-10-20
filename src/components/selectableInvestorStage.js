import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as types from '../actions/types';
import { STAGEPROPS } from '../constants';
import StageIcon from './people/StageIcon';

function Stage(props) {
  const { stage, current, onClick } = props;
  return (
    <button
      className={`stage ${current && 'current'}`}
      onClick={() => onClick()}
      type="button"
    >
      <StageIcon current stage />
      <div>
        {STAGEPROPS[stage].text}
      </div>
    </button>
  );
}

export default function SelectInvestorStage(props) {
  const { uuid } = props;

  const investorStatus = useSelector(state => state.manageRaise.results[uuid]) || {};

  const { stage } = investorStatus;

  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const updateStatus = params => dispatch({
    type: types.USER_POST_INVESTORSTATUS_REQUESTED,
    params,
  });

  const onSelected = newStage => {
    const params = {
      stage: newStage,
      uuid,
    };
    updateStatus(params);
  };


  return (
    <div className="selectInvestorStage">
      <div className={`${open && 'sr-only'}`}>
        <Stage stage={stage} current onClick={setOpen(true)} />
      </div>
      <ul className={`${!open && 'sr-only'}`}>
        {Object.keys(STAGEPROPS).map(k => (
          <Stage stage={k} current={k === stage} onClick={onSelected(k)} />
        ))}
      </ul>
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
