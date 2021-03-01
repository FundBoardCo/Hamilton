import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { v4 as uuidv4 } from 'uuid';
import InvestorNameTag from '../../components/people/PersonNameTag';
import SelectableInvestorStage from '../../components/people/SelectableInvestorStage';
import * as types from '../../actions/types';
import DismissibleStatus from '../../components/DismissibleStatus';
import EditNote from './EditNote';
import Note from './Note';
import EditIntro from './EditIntro';
import { STAGEPROPS } from '../../constants';
import { formatCur } from '../../utils';
import Intro from './Intro';

export default function InvestorRaise(props) {
  const {
    uuid,
    data = {},
    path,
  } = props;

  const {
    objectId,
    stage = 'added',
    notes = {},
    amount = 0,
    published,
    intros = {},
  } = data;

  const { advice } = STAGEPROPS[stage];
  const postStatus = useSelector(state => state.investors.postOwnInvestor_status) || '';
  const noteParams = useSelector(state => state.investors.editNoteParams);

  const [amountValue, setAmount] = useState(amount);
  const [showEditAmount, setShowEditAmount] = useState(false);
  const [showEditIntro, setShowEditIntro] = useState(false);
  const [introToEdit, setIntroToEdit] = useState();

  const dispatch = useDispatch();

  const updateStatus = params => dispatch({
    type: types.USER_POST_INVESTOR_REQUESTED,
    params,
  });

  const setNoteID = params => dispatch({
    type: types.USER_SET_EDITNOTE,
    params,
  });

  const onSaveAmount = () => {
    const params = {
      objectId,
      amount: amountValue,
    };
    updateStatus(params);
    setShowEditAmount(false);
  };

  const onTogglePublish = () => {
    const params = {
      objectId,
      published: !published,
    };
    updateStatus(params);
  };

  const onToggleArchive = () => {
    const params = {
      objectId,
      stage: stage === 'archived' ? 'added' : 'archived',
    };
    updateStatus(params);
  };

  const onEditManualClick = () => {
    dispatch({
      type: types.MODAL_SET_OPEN,
      modal: 'editInvestor',
      modalProps: {
        ...data,
      },
    });
  };

  const onNewNote = () => {
    setNoteID({ noteID: String(Math.floor(Math.random() * 100000000)), uuid });
  };

  const onClickEditIntro = introID => {
    setShowEditIntro(introID);
    setIntroToEdit(intros[introID] || {});
  };

  const onDeleteIntro = introID => {
    const newIntros = { ...intros };
    delete newIntros[introID];
    const params = {
      objectId,
      intros: newIntros,
    };
    updateStatus(params);
  };

  const showAmount = ['negotiating', 'invested', 'leading'].includes(stage);
  let amountText = stage === 'negotiating'
    ? 'Investment target' : 'Amount Invested';
  amountText = `${amountText}: ${formatCur(amountValue)}`;

  return (
    <div>
      <InvestorNameTag data={data} path={path} />
      <DismissibleStatus
        status={postStatus}
        showSuccess={false}
        statusPrefix="Updating investor"
        dissmissAction={types.USER_POST_INVESTOR_DISMISSED}
      />
      <div>
        <Button
          variant="link"
          onClick={onEditManualClick}
        >
          Edit Investor
        </Button>
      </div>
      <section className="mb-4">
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
      <section className="mb-4">
        <h2 className="sectionHead">Introduced By</h2>
        {!showEditIntro && Object.keys(intros).map(k => {
          const i = intros[k];
          const introProps = {
            ...i,
            uuid: k,
            onClick: onClickEditIntro,
            onDelete: onDeleteIntro,
          };
          return <Intro key={k} {...introProps} />;
        })}
        {showEditIntro && introToEdit ? (
          <EditIntro
            {...data}
            intros={{ ...intros }}
            toEdit={showEditIntro}
            intro={introToEdit}
            isInBoard={true}
            onSubmit={() => setShowEditIntro(false)}
            onCancel={() => setShowEditIntro(false)}
          />
        ) : (
          <div>
            <div className="d-flex mb-2">
              <div className="flex-grow-1">
                <div className="mb-1">
                  Add New Intro
                </div>
              </div>
              <div>
                <button
                  className="btn iconBtn text-primary"
                  type="button"
                  onClick={() => onClickEditIntro(uuidv4())}
                >
                  <FontAwesomeIcon icon="edit" className="txs-2" />
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
      <section className="mb-4">
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
      <section className="mb-4">
        <h2 className="sectionHead">
          {published ? 'Public' : 'Private'}
        </h2>
        <div className="d-flex">
          <p className="mr-4">
            Change whether this investor is visible on your public board.
          </p>
          <span className="flex-shrink-0 ml-auto">
            <Button
              variant="link"
              className={published ? 'primary' : 'warning'}
              onClick={onTogglePublish}
            >
              <FontAwesomeIcon className="mr-2" icon={published ? 'eye-slash' : 'eye'} />
              {published ? 'Make Private' : 'Make Public'}
            </Button>
          </span>
        </div>
      </section>
      <section className="mb-4">
        <h2 className="sectionHead">
          Archive
        </h2>
        <div className="d-flex">
          <p className="mr-4">
            If you no longer want to see this investor on your board, you can archive them.
          </p>
          <span className="flex-shrink-0 ml-auto">
            <Button
              variant="link"
              className={stage === 'archived' ? 'primary' : 'warning'}
              onClick={onToggleArchive}
            >
              <FontAwesomeIcon className="mr-2" icon={stage === 'archived' ? 'recycle' : 'archive'} />
              {stage === 'archived' ? 'Unarchive' : 'Archive'}
            </Button>
          </span>
        </div>
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
