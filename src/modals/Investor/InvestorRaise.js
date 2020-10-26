import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import InvestorNameTag from './InvestorNameTag';
import SelectableInvestorStage from '../../components/people/SelectableInvestorStage';
import * as types from '../../actions/types';
import DismissibleStatus from '../../components/DismissibleStatus';
import EditNote from './EditNote';
import { STAGEPROPS } from '../../constants';

function Note(props) {
  const {
    text,
    date,
    next,
    onClick,
  } = props;
  return (
    <button
      className="note"
      type="button"
      onClick={onClick}
    >
      {(date || next) && (
        <div className="date">
          {`${next ? 'Next ' : ''}${date || ''}`}
        </div>
      )}
      <div className="text">{text}</div>
    </button>
  );
}

export default function InvestorRaise(props) {
  const { uuid, data = {}, path } = props;

  const investorStatus = useSelector(state => state.manageRaise.records[uuid]);
  const {
    id,
    stage,
    notes,
    amount,
  } = investorStatus;
  const { advice } = STAGEPROPS[stage];
  const postStatus = useSelector(state => state.manageRaise.post_status) || '';
  const noteParams = useSelector(state => state.manageRaise.editNoteParams);

  const [amountValue, setAmount] = useState(amount);

  const dispatch = useDispatch();

  const updateStatus = params => dispatch({
    type: types.USER_POST_INVESTORSTATUS_REQUESTED,
    params,
  });

  const setNoteID = params => dispatch({
    type: types.USER_SET_EDITNOTE,
    params,
  });

  const onSaveAmount = () => {
    const params = {
      id,
      uuid,
      amount: amountValue,
    };
    updateStatus(params);
  };

  const onEditNote = noteID => {
    setNoteID({ noteID, uuid });
  };

  const onNewNote = () => {
    setNoteID({ noteID: String(Math.floor(Math.random() * 100000000)), uuid });
  };

  const showAmount = ['negotiating', 'invested', 'leading'].includes(stage);
  const amountText = stage === 'negotiating'
    ? 'You are Asking Them to Invest' : 'Amount They Invested';

  return (
    <div>
      <InvestorNameTag data={data} path={path} />
      <DismissibleStatus
        status={postStatus}
        showSuccess={false}
        dissmissAction={types.USER_POST_INVESTORSTATUS_DISMISSED}
      />
      <section className="mb-3">
        <div className="mt-3">
          <SelectableInvestorStage uuid={uuid} />
        </div>
        {showAmount && (
          <div>
            <label htmlFor="raise-amount">{amountText}</label>
            <InputGroup className="mb-2">
              <InputGroup.Prepend>
                <InputGroup.Text>$</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                type="number"
                min={1000}
                step={1000}
                max={10000000000}
                value={amountValue}
                onChange={e => setAmount(Number(e.target.value))}
                aria-label="Amount (to the nearest dollar)"
              />
              <InputGroup.Append>
                <Button
                  variant="secondary"
                  onClick={onSaveAmount}
                >
                  Save
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </div>
        )}
        {advice && (
          <div>{`${advice}`}</div>
        )}
      </section>
      <section>
        <h2 className="sectionHead">Notes & Next Steps</h2>
        <div className="editWrapper">
          {noteParams.noteID && <EditNote />}
        </div>
        <div className="nextWrapper">
          {!noteParams.noteID && Object.keys(notes).map(k => {
            const nData = notes[k];
            if (!nData.next) return null;
            return <Note id={k} key={k} {...nData} onClick={() => onEditNote(k)} />;
          })}
        </div>
        <div className="notesWrapper">
          {!noteParams.noteID && Object.keys(notes).map(k => {
            const nData = notes[k];
            if (nData.next) return null;
            return <Note id={k} key={k} {...nData} onClick={() => onEditNote(k)} />;
          })}
        </div>
        {!noteParams.noteID && (
          <Button
            variant="outline-primary"
            className="btnMobile100"
            onClick={onNewNote}
          >
            Add a note or next step
          </Button>
        )}
      </section>
    </div>
  );
}

InvestorRaise.defaultProps = {
  uuid: '',
  data: {},
  path: '',
};

InvestorRaise.propTypes = {
  uuid: PropTypes.string,
  data: PropTypes.shape({
    params: PropTypes.objectOf(PropTypes
      .oneOfType([PropTypes.bool, PropTypes.string, PropTypes.objectOf(PropTypes.string)])),
  }),
  path: PropTypes.string,
};

Note.defaultProps = {
  date: '',
  text: '',
  next: false,
  onClick: {},
};

Note.propTypes = {
  date: PropTypes.string,
  text: PropTypes.string,
  next: PropTypes.bool,
  onClick: PropTypes.func,
};
