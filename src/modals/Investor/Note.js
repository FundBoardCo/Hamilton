import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as types from '../../actions/types';
import { aFormDate } from '../../utils';

export default function Note(props) {
  const {
    noteID,
    uuid,
  } = props;

  const investorStatus = useSelector(state => state.manageRaise.records[uuid]);
  const { notes } = investorStatus;
  const investorID = investorStatus.id;
  const noteData = notes[noteID] || {};

  const {
    text,
    date,
    next,
    waiting,
  } = noteData;

  const dispatch = useDispatch();

  const setNoteID = params => dispatch({
    type: types.USER_SET_EDITNOTE,
    params,
  });

  const onEditNote = () => {
    setNoteID({ noteID, uuid });
  };

  const updateStatus = params => dispatch({
    type: types.USER_POST_INVESTOR_REQUESTED,
    params,
  });

  const onCompleteNote = () => {
    const params = {
      id: investorID,
      uuid,
      notes: {
        ...notes,
        [noteID]: {
          ...notes[noteID],
          date: null,
          next: false,
          waiting: false,
        },
      },
    };
    updateStatus(params);
  };

  let nextLabel = '';
  if (next) nextLabel = 'To Do Next';
  if (waiting) nextLabel= 'Waiting For'

  return (
    <div
      className="note"
    >
      {next && (
        <button
          className="fauxCheckBox"
          type="button"
          onClick={onCompleteNote}
        >
          <span className="sr-only">Mark as Completed</span>
        </button>
      )}
      <button
        className="body"
        type="button"
        onClick={onEditNote}
      >
        <div className="content">
          {(date || next) && (
            <div className={`date ${waiting ? 'waiting' : ''}`}>
              {`${nextLabel} ${date ? `- ${aFormDate(date)}` : ''}`}
            </div>
          )}
          <div className="text">{text}</div>
        </div>
        <div className="icon">
          <FontAwesomeIcon icon="edit" />
        </div>
      </button>
    </div>
  );
}

Note.defaultProps = {
  noteID: '',
  uuid: '',
};

Note.propTypes = {
  noteID: PropTypes.string,
  uuid: PropTypes.string,
};
