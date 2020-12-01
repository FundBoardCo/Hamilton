import React, { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import DatePicker from 'react-datepicker';
import * as types from '../../actions/types';
import Status from '../../components/DismissibleStatus';

export default function EditIntro(props) {
  const form = useRef(null);

  const {
    id,
    isPublic,
    onSubmit,
    onCancel,
    intro_name = '',
    intro_email = '',
    intro_date,
    stage,
  } = props;

  const parsedDate = Number.isNaN(Date.parse(intro_date)) ? Date.now() : new Date(intro_date);

  const postStatus = useSelector(state => state.manageRaise.publicPost_status) || '';

  const [validated, setValidated] = useState(false);

  const [nameVal, setNameVal] = useState(intro_name);
  const [emailVal, setEmailVal] = useState(intro_email);
  const [dateVal, setDateVal] = useState(parsedDate);

  const dispatch = useDispatch();

  const updateStatus = params => dispatch({
    type: isPublic
      ? types.PUBLIC_POST_INVESTORSTATUS_REQUESTED
      : types.USER_POST_INVESTORSTATUS_REQUESTED,
    params,
  });

  const handleSubmit = event => {
    const formNode = form.current;
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
    const publicProps = {};
    if (isPublic || !stage || ['none', 'added'].includes(stage)) {
      publicProps.stage = 'connected';
    }
    if (formNode.checkValidity() !== false) {
      const p = {
        id,
        intro_name: nameVal,
        intro_email: emailVal,
        intro_date: dateVal,
        ...publicProps,
      };
      updateStatus(p);
      if (onSubmit) onSubmit();
    }
  };

  const onNameChange = e => {
    setNameVal(e.target.value);
  };

  const onEmailChange = e => {
    setEmailVal(e.target.value);
  };

  const onDateChange = d => {
    setDateVal(d);
  };

  const onCancelClick = () => {
    onCancel();
  };

  const publicFormProps = {};
  if (isPublic) publicFormProps.required = true;

  return (
    <Form
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
      ref={form}
    >
      <Form.Group controlId="NameInput">
        <Form.Label className="sr-only">Name</Form.Label>
        <Form.Control
          {...publicFormProps}
          type="text"
          placeholder={isPublic ? 'Your name' : 'Name'}
          value={nameVal}
          onChange={e => onNameChange(e)}
          data-track="MakeIntro-Name"
        />
        <Form.Control.Feedback type="invalid">
          Please enter a valid name.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group controlId="EmailInput">
        <Form.Label className="sr-only">Email Address</Form.Label>
        <Form.Control
          {...publicFormProps}
          type="email"
          placeholder="email address"
          value={emailVal}
          onChange={e => onEmailChange(e)}
          data-track="MakeIntro-Email"
        />
        {isPublic && (
          <Form.Text>
            Enter your email so this founder can contact you.&nbsp;
            We won’t share or use it in any other way.
          </Form.Text>
        )}
        <Form.Control.Feedback type="invalid">
          Please enter a valid email address.
        </Form.Control.Feedback>
      </Form.Group>
      <h5>
        This introduction was made on:
      </h5>
      <div className="datePickerWrapper mb-2">
        <DatePicker
          showTimeSelect
          selected={dateVal}
          dateFormat="MMMM d, yyyy h:mm aa"
          isClearable
          onChange={d => onDateChange(d)}
        />
      </div>
      {isPublic && (
        <Form.Text className="mb-2">
          Leave the date blank if will make the intro soon, but haven’t done it yet.
        </Form.Text>
      )}
      <Status
        statusPrefix="Make Introduction:"
        status={postStatus}
        dissmissAction={types.PUBLIC_POST_INVESTORSTATUS_DISMISSED}
      />
      <div className="footerBtnWrapper mt-3">
        <Button
          variant="danger"
          className="mr-3 btnNoMax"
          data-track="MakeIntro-Cancel"
          onClick={onCancelClick}
        >
          Cancel
        </Button>
        <Button
          variant="success"
          className="btnNoMax"
          data-track="MakeIntro-Save"
          onClick={handleSubmit}
        >
          Save
        </Button>
      </div>
    </Form>
  );
}

EditIntro.defaultProps = {
  id: '',
  isPublic: false,
  onSubmit: {},
  onCancel: {},
  intro_name: '',
  intro_email: '',
  intro_date: '',
  stage: '',
};

EditIntro.propTypes = {
  id: PropTypes.string,
  isPublic: PropTypes.bool,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  intro_name: PropTypes.string,
  intro_email: PropTypes.string,
  intro_date: PropTypes.string,
  stage: PropTypes.string,
};
