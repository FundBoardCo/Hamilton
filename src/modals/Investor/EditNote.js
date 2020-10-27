import React, {useRef, useState} from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'react-datepicker';
import Form from 'react-bootstrap/Form';
import * as types from '../../actions/types';
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

const noteTypes = [
  {
    type: 'note',
    text: 'This is a note',
  },
  {
    type: 'next',
    text: 'This is a Next Step for me',
  },
  {
    type: 'waiting',
    text: 'This is something I’m waiting for',
  },
];

export default function EditNote() {
  const form = useRef(null);
  const noteParams = useSelector(state => state.manageRaise.editNoteParams);
  const { uuid } = noteParams;
  const { noteID } = noteParams;

  const investorStatus = useSelector(state => state.manageRaise.records[uuid]);
  const { notes } = investorStatus;
  const investorID = investorStatus.id;
  const toEdit = notes[noteID] || {};
  const {
    text,
    date,
    next,
    waiting,
  } = toEdit;
  let type = next ? 'next' : 'note';
  if (waiting) type = 'waiting';

  const parsedDate = Number.isNaN(Date.parse(date)) ? '' : new Date(date);
  const [textVal, setTextVal] = useState(text);
  const [dateVal, setDateVal] = useState(parsedDate);
  const [typeVal, setTypeVal] = useState(type);
  const [validated, setValidated] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const dispatch = useDispatch();

  const updateStatus = params => dispatch({
    type: types.USER_POST_INVESTORSTATUS_REQUESTED,
    params,
  });

  const onCancel = () => dispatch({
    type: types.USER_SET_EDITNOTE,
    params: { noteID: null },
  });

  const onSave = () => {
    const params = {
      id: investorID,
      uuid,
      notes: {
        ...notes,
        [noteID]: {
          text: textVal,
          date: dateVal,
          next: ['next', 'waiting'].includes(typeVal),
          waiting: typeVal === 'waiting',
        },
      },
    };

    const formNode = form.current;
    setValidated(true);
    if (formNode.checkValidity() !== false) {
      updateStatus(params);
    }
  };

  const onTextChange = e => {
    const input = e.currentTarget;
    const val = e.target.value;
    setValidated(true);
    if (input.checkValidity()) {
      setIsValid(true);
      setTextVal(val);
    } else {
      setTextVal(val);
      setIsValid(false);
    }
  };

  const onDateChange = d => {
    setDateVal(d);
  };

  const onTypeChange = t => {
    setTypeVal(t);
  };

  // null this out when there is no note to edit
  if (!noteID) return null;

  return (
    <div className="editNote">
      <Form
        noValidate
        validated={validated}
        ref={form}
        className="d-flex flex-column"
      >
        <Form.Group
          controlId="NoteTextInput"
          className="flex-md-grow-1"
        >
          <Form.Label className="sr-only">The Text of This Note</Form.Label>
          <Form.Control
            required
            as="textarea"
            name="note text"
            rows={3}
            placeholder="Note text"
            value={textVal}
            onChange={e => onTextChange(e)}
            isInvalid={validated && !isValid}
            data-track="Investor-Note-EditText"
          />
          <Form.Control.Feedback type="invalid">
            Please enter valid text.
          </Form.Control.Feedback>
        </Form.Group>
        <div className="datePickerWrapper mb-2">
          <DatePicker
            showTimeSelect
            selected={dateVal}
            dateFormat="MMMM d, yyyy h:mm aa"
            isClearable
            onChange={d => onDateChange(d)}
          />
        </div>
        <div className="mb-2">
          {noteTypes.map(t => (
            <Form.Check
              type="radio"
              id={t.type}
              key={t.type}
              label={t.text}
              checked={t.type === typeVal}
              onChange={() => onTypeChange(t.type)}
            />
          ))}
        </div>
        <div className="d-flex">
          <Button
            variant="success"
            className="flex-grow-1 mr-2 btnResponsiveMax"
            onClick={onSave}
          >
            Save
          </Button>
          <Button
            variant="outline-primary"
            className="flex-grow-1 btnResponsiveMax"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  );
}
