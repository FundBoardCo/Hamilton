import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InvestorNameTag from '../../components/people/PersonNameTag';
import SelectableInvestorStage from '../../components/people/SelectableInvestorStage';
import * as types from '../../actions/types';
import DismissibleStatus from '../../components/DismissibleStatus';
import EditNote from './EditNote';
import Note from './Note';
import EditIntro from './EditIntro';
import { STAGEPROPS } from '../../constants';
import { aFormDate, formatCur } from '../../utils';

export default function InvestorRaise(props) {
  const {
    uuid,
    data = {},
    path,
    manualRecordID,
  } = props;

  const investorStatus = useSelector(state => state.manageRaise.records[uuid]) || {};
  const {
    id,
    stage = 'added',
    notes = {},
    amount = 0,
    published,
  } = investorStatus;
  const { advice } = STAGEPROPS[stage];
  const postStatus = useSelector(state => state.manageRaise.post_status) || '';
  const noteParams = useSelector(state => state.manageRaise.editNoteParams);

  const [amountValue, setAmount] = useState(amount);
  const [showEditAmount, setShowEditAmount] = useState(false);
  const [showEditIntro, setShowEditIntro] = useState(false);

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

  const onTogglePublish = () => {
    const params = {
      id,
      uuid,
      published: !published,
    };
    updateStatus(params);
  };

  const onEditManualClick = () => {
    dispatch({
      type: types.MODAL_SET_OPEN,
      modal: 'editInvestor',
      modalProps: {
        ...data,
        uuid,
        recordID: manualRecordID,
      },
    });
  };

  const onNewNote = () => {
    setNoteID({ noteID: String(Math.floor(Math.random() * 100000000)), uuid });
  };

  const showAmount = ['negotiating', 'invested', 'leading'].includes(stage);
  let amountText = stage === 'negotiating'
    ? 'You are Asking Them to Invest' : 'Amount They Invested';
  amountText = `${amountText}: ${formatCur(amountValue)}`;

  return (
    <div>
      <InvestorNameTag data={data} path={path} />
      <DismissibleStatus
        status={postStatus}
        showSuccess={false}
        dissmissAction={types.USER_POST_INVESTORSTATUS_DISMISSED}
      />
      {manualRecordID && (
        <div>
          <Button
            variant="link"
            onClick={onEditManualClick}
          >
            Edit Manually Entered Investor
          </Button>
        </div>
      )}
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
      <section className="mb-3">
        <h2 className="sectionHead">
          {published ? 'Published' : 'Private'}
        </h2>
        <div className="d-flex">
          <p>
            You can change whether this investor is visible on your public board by publishing or
            unpublishing them.
          </p>
          <span className="flex-shrink-0 ml-2">
            <Button
              variant="link"
              className={published ? 'primary' : 'warning'}
              onClick={onTogglePublish}
            >
              <FontAwesomeIcon className="mr-2" icon={published ? 'eye-slash' : 'eye'} />
              {published ? 'Make Private' : 'Publish'}
            </Button>
          </span>
        </div>
      </section>
      <section className="mb-3">
        <h2 className="sectionHead">Introduced By</h2>
        {showEditIntro ? (
          <EditIntro
            {...investorStatus}
            onSubmit={() => setShowEditIntro(false)}
            onCancel={() => setShowEditIntro(false)}
          />
        ) : (
          <div className="d-flex">
            <div className="flex-grow-1">
              <div className="mb-1">{investorStatus.intro_name}</div>
              <div className="mb-1">
                <a href={`mailto://${investorStatus.intro_email}`}>
                  {investorStatus.intro_email}
                </a>
              </div>
              <div className="mb-1">
                {`On ${aFormDate(investorStatus.intro_date)}`}
              </div>
            </div>
            <div>
              <button
                className="btn iconBtn text-primary"
                type="button"
                onClick={() => setShowEditIntro(true)}
              >
                <FontAwesomeIcon icon="edit" className="txs-2" />
              </button>
            </div>
          </div>
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
  manualRecordID: '',
};

InvestorRaise.propTypes = {
  uuid: PropTypes.string,
  data: PropTypes.shape({
    params: PropTypes.objectOf(PropTypes
      .oneOfType([PropTypes.bool, PropTypes.string, PropTypes.objectOf(PropTypes.string)])),
  }),
  path: PropTypes.string,
  manualRecordID: PropTypes.string,
};
