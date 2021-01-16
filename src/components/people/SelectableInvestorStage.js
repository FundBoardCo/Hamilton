import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as types from '../../actions/types';
import { STAGEPROPS } from '../../constants';
import StageIcon from './StageIcon';

function Stage(props) {
  const {
    stage,
    current,
    onClick,
    index,
    currentIndex,
    open,
  } = props;
  let indexClass = '';
  if (typeof index === 'number' && typeof currentIndex === 'number' && index < currentIndex) {
    indexClass = 'beforeCurrent';
  }
  let firstClass = '';
  if (index === 0 && !open) firstClass = 'firstClosed';

  return (
    <button
      className={`stage ${current ? 'current' : ''} ${indexClass} ${firstClass}`}
      onClick={() => onClick()}
      type="button"
    >
      <StageIcon current={current} stage={stage} />
      <div className="stageText">
        {STAGEPROPS[stage].text}
      </div>
      {current && <FontAwesomeIcon className="caret" icon={open ? 'caret-down' : 'caret-left'} />}
    </button>
  );
}

export default function SelectInvestorStage(props) {
  const { uuid } = props;

  const investorStatus = useSelector(state => state.investors.ownInvestors[uuid]) || {};
  const userUUID = useSelector(state => state.user.uuid);
  const stageKeys = Object.keys(STAGEPROPS);

  const { objectId, stage = 'added' } = investorStatus;

  const currentIndex = stageKeys.indexOf(stage);

  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  const updateStatus = params => dispatch({
    type: types.USER_POST_INVESTOR_REQUESTED,
    params,
  });

  const onSelected = newStage => {
    const params = {
      objectId,
      stage: newStage,
      uuid,
      profileUUID: userUUID,
    };
    updateStatus(params);
    setOpen(false);
  };

  return (
    <div className="selectInvestorStage">
      <Stage
        stage={stage}
        current
        open={open}
        onClick={() => setOpen(!open)}
      />
      <div className={`${!open ? 'sr-only' : ''}`}>
        {stageKeys.map((k, i) => {
          if (k !== stage && k !== 'none') {
            return (
              <Stage
                stage={k}
                current={k === stage}
                key={k}
                onClick={() => onSelected(k)}
                index={i}
                currentIndex={currentIndex}
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
  index: 0,
  currentIndex: 0,
  open: false,
};

Stage.propTypes = {
  stage: PropTypes.string,
  current: PropTypes.bool,
  onClick: PropTypes.func,
  index: PropTypes.number,
  currentIndex: PropTypes.number,
  open: PropTypes.bool,
};
