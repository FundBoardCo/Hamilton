import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import DatePicker from 'react-datepicker';
import { useHistory, useLocation } from 'react-router';
import * as types from '../../actions/types';
import Status from '../../components/DismissibleStatus';
import { aFormDate } from '../../utils';

function checkUniqueIntro(email, intros) {
  const emails = Object.keys(intros).map(k => intros[k].intro_email);
  return !emails.includes(email);
}

export default function EditIntro(props) {
  const form = useRef(null);

  const {
    uuid,
    objectId,
    isPublic,
    onSubmit,
    onCancel,
    intro,
    intros = {},
    toEdit,
    isInBoard,
  } = props;
  const {
    intro_name = '',
    intro_email = '',
    intro_date = '',
  } = intro;

  const parsedDate = Number.isNaN(Date.parse(intro_date)) ? Date.now() : new Date(intro_date);

  const privateStatus = useSelector(state => state.investors.postOwnInvestor_status);
  const publicStatus = useSelector(state => state.founders.post_intro_status);
  const postStatus = isPublic ? publicStatus : privateStatus;
  const userEmail = useSelector(state => state.user.email) || '';

  const [validated, setValidated] = useState(false);

  // If not editing an email and it is not the user's own page, use their email if known.
  const defaultEmail = intro_email || (isPublic && userEmail) || '';

  const [nameVal, setNameVal] = useState(intro_name);
  const [emailVal, setEmailVal] = useState(defaultEmail);
  const [dateVal, setDateVal] = useState(parsedDate);
  const [showNotUnique, setShowNotUnique] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: isPublic
        ? types.PUBLIC_POST_INTRO_DISMISSED
        : types.USER_POST_INVESTOR_DISMISSED,
    });
  }, [isPublic, dispatch]);

  const updateStatus = params => dispatch({
    type: isPublic
      ? types.PUBLIC_POST_INTRO_REQUESTED
      : types.USER_POST_INVESTOR_REQUESTED,
    params,
  });

  const updateEmail = email => dispatch({
    type: types.USER_LOCAL_UPDATE_REQUESTED,
    data: { email },
  });

  const handleSubmit = event => {
    const formNode = form.current;
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
    if (checkUniqueIntro(emailVal, intros)) {
      if (showNotUnique) setShowNotUnique(false);
      if (formNode.checkValidity() !== false) {
        const p = {
          objectId,
          uuid,
          intros: {
            ...intros,
            [toEdit]: {
              intro_name: nameVal,
              intro_email: emailVal,
              intro_date: aFormDate(moment(dateVal)),
            },
          },
        };
        updateStatus(p);
        if (!userEmail) updateEmail(emailVal);
        if (onSubmit) onSubmit();
      }
    } else {
      setShowNotUnique(true);
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

  const history = useHistory();

  const onOpenOnBoardClick = () => {
    dispatch({
      type: types.MODAL_SET_OPEN,
      modal: null,
    });
    history.push(`/board/${uuid}`);
  };

  const publicFormProps = {};
  if (isPublic) publicFormProps.required = true;

  const location = useLocation();
  const isBoard = location.pathname.substring(1).split('/')[0] === 'board';

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
            Enter your email so this founder can reach out to you.&nbsp;
            We won’t share or use it in any other way.
          </Form.Text>
        )}
        <Form.Control.Feedback type="invalid">
          Please enter a valid email address.
        </Form.Control.Feedback>
      </Form.Group>
      {!isPublic && isBoard && (
        <div>
          <h5>
            This offer to connect was made on:
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
        </div>
      )}
      {!isPublic && !isInBoard && (
        <Button
          variant="link"
          className="mb-2"
          data-track="MakeIntro-OpenOnBoard"
          onClick={onOpenOnBoardClick}
        >
          Edit on my private board
        </Button>
      )}
      <Status
        statusPrefix="Make Introduction:"
        status={postStatus}
        dissmissAction={
          isPublic ? types.PUBLIC_POST_INTRO_DISMISSED : types.USER_POST_INVESTOR_DISMISSED
        }
      />
      <Status
        statusPrefix="Error:"
        status={showNotUnique ? 'This offer has already been made. You can\'t offer the same introduction twice.' : ''}
        show={showNotUnique}
      />
      {!uuid && (
        <div className="text-secondary p-2">
          {'This is just an example intro, this user hasn\'t created an account yet.'}
        </div>
      )}
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
          disabled={!uuid}
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
  uuid: '',
  isPublic: false,
  intro: {
    intro_name: '',
    intro_email: '',
    intro_date: '',
  },
  intros: {},
  isInBoard: false,
};

EditIntro.propTypes = {
  uuid: PropTypes.string,
  objectId: PropTypes.string.isRequired,
  isPublic: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  intro: PropTypes.shape({
    intro_name: PropTypes.string,
    intro_email: PropTypes.string,
    intro_date: PropTypes.string,
  }),
  intros: PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)),
  toEdit: PropTypes.string.isRequired,
  isInBoard: PropTypes.bool,
};
