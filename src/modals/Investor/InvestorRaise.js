import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InvestorNameTag from './InvestorNameTag';
import SelectableInvestorStage from '../../components/people/SelectableInvestorStage';
import * as types from '../../actions/types';
import DismissibleStatus from '../../components/DismissibleStatus';
import EditNote from './EditNote';
import Note from './Note';
import { STAGEPROPS } from '../../constants';

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
  const [showEditAmount, setShowEditAmount] = useState(false);

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
    setShowEditAmount(false);
  };

  const onNewNote = () => {
    setNoteID({ noteID: String(Math.floor(Math.random() * 100000000)), uuid });
  };

  const showAmount = ['negotiating', 'invested', 'leading'].includes(stage);
  let amountText = stage === 'negotiating'
    ? 'You are Asking Them to Invest' : 'Amount They Invested';
  amountText = `${amountText}: $${amountValue}`;

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
        {showAmount && !showEditAmount && (
          <div className="d-flex align-items-center">
            <span>{amountText}</span>
            <button
              className="btn iconBtn ml-auto text-primary"
              type="button"
              onClick={() => setShowEditAmount(true)}
            >
              <span className="sr-only">Edit Investment Amount</span>
              <FontAwesomeIcon icon="edit" />
            </button>
          </div>
        )}
        {showAmount && showEditAmount && (
          <div>
            <div className="d-flex align-items-center mb-2">
              <label
                className="mb-0"
                htmlFor="raise-amount"
              >
                {amountText}
              </label>
              <button
                className="btn btn-link ml-auto"
                type="button"
                onClick={() => setShowEditAmount(false)}
              >
                cancel
              </button>
            </div>
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
            if (!notes[k].next) return null;
            return <Note noteID={k} key={k} uuid={uuid} />;
          })}
        </div>
        <div className="notesWrapper">
          {!noteParams.noteID && Object.keys(notes).map(k => {
            if (notes[k].next) return null;
            return <Note noteID={k} key={k} uuid={uuid} />;
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
