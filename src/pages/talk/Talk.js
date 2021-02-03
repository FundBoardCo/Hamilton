import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import moment from 'moment';
import platform from 'platform';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as types from '../../actions/types';
import DismissibleStatus from '../../components/DismissibleStatus';

export default function Talk() {
  const feedbackStatus = useSelector(state => state.airtable.feedback_status);
  const email = useSelector(state => state.user.email);

  const [validated, setValidated] = useState(false);

  const [comment, setComment] = useState('');

  const [emailValue, setEmailValue] = useState(email);

  const [thumbsUp, setThumbsUp] = useState(true);

  const [showStatus, setShowStatus] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: types.FEEDBACK_SEND_DISMISSED,
    });
  }, [dispatch]);

  const sendFeedback = () => dispatch({
    type: types.FEEDBACK_SEND_REQUESTED,
    params: {
      email: emailValue,
      thumbsup: thumbsUp,
      comment,
      date: moment().format(),
      platform: `${platform.name} v${platform.version}`,
      os: platform.os.toString(),
      product: platform.product,
      manufacturer: platform.manufacturer,
      description: platform.description,
      language: navigator.language,
    },
  });

  const handleSubmit = event => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    setValidated(true);
    if (form.checkValidity() !== false) {
      setShowStatus(true);
      sendFeedback();
    }
  };

  const onCommentChange = e => {
    setComment(e.target.value);
  };

  const onEmailChange = e => {
    setEmailValue(e.target.value);
  };

  const onThumbsClick = val => {
    setThumbsUp(val);
  };

  const onEmailOffClick = () => {
    setEmailValue('');
  };

  return (
    <Row id="PageTalk" className="pageContainer">
      <Col xs={12} md={8} className="mr-auto ml-auto">
        <div className="mb-4">
          <h1 className="text-center">Talk to Us</h1>
          <p className="text-center">You can get help, leave feedback, and find out more about FundBoard here.</p>
        </div>
        <Form
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
          className="mb-4"
        >
          <Form.Group controlId="CommentInput">
            <Form.Label className="sr-only">Your feedback</Form.Label>
            <Form.Control
              required
              as="textarea"
              rows={3}
              placeholder="Leave feedback or questions here."
              value={comment}
              onChange={e => onCommentChange(e)}
              data-track="TalkCommentInput"
            />
            <Form.Control.Feedback type="invalid">
              Please enter a comment, question or other feedback.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="EmailInput">
            <Form.Label className="sr-only">Email address (optional)</Form.Label>
            <InputGroup>
              <Form.Control
                type="email"
                placeholder="email address"
                value={emailValue}
                onChange={e => onEmailChange(e)}
                data-track="TalkEmailInput"
              />
              <InputGroup.Append>
                <Button
                  variant="outline-primary"
                  onClick={onEmailOffClick}
                  data-track="TalkEmailInput-toggle"
                >
                  <span>
                    <FontAwesomeIcon icon="times" />
                  </span>
                </Button>
              </InputGroup.Append>
            </InputGroup>
            <Form.Control.Feedback type="invalid">
              Please enter a valid email address.
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex mb-4 align-items-center">
            <span className="mr-auto">
              Let us know how we&apos;re doing:
            </span>
            <Button
              variant="secondary"
              className={`${thumbsUp ? '' : 'op-1'} mr-2`}
              onClick={() => onThumbsClick(true)}
              data-track="TalkThumbsUp"
            >
              <FontAwesomeIcon icon="thumbs-up" />
              <span className="sr-only">Give us a thumbs up.</span>
            </Button>
            <Button
              variant="danger"
              className={thumbsUp ? 'op-1' : ''}
              onClick={() => onThumbsClick(false)}
              data-track="TalkThumbsDown"
            >
              <FontAwesomeIcon icon="thumbs-down" />
              <span className="sr-only">Give us a thumbs down.</span>
            </Button>
          </div>
          <DismissibleStatus
            status={feedbackStatus}
            show={showStatus}
            dissmissAction={types.FEEDBACK_SEND_DISMISSED}
          />
          <Button
            className="btnNoMax w-100"
            variant="primary"
            type="submit"
            data-track="TalkSubmit"
          >
            Submit
          </Button>
        </Form>
        <hr className="mb-4" />
        <h2>Learn More About FundBoard</h2>
        <p>Curious about the people and motivation behind FundBoard?</p>
        <ul>
          <li className="mb-2">
            You can start with &nbsp;
            <a
              href="https://www.fundboard.co"
              target="_blank"
              rel="noopener noreferrer"
              data-track="TalkLink-FundBoard"
            >
              FundBoard.co
            </a>
          </li>
          <li className="mb-2">
            Then read our&nbsp;
            <a
              href="https://www.fundboard.co/our-take"
              target="_blank"
              rel="noopener noreferrer"
              data-track="TalkLink-FundBoardBlog"
            >
              blog.
            </a>
          </li>
          <li className="mb-2">
            And sign up for&nbsp;
            <a
              href="https://www.fundboard.co/say-hello"
              target="_blank"
              rel="noopener noreferrer"
              data-track="TalkLink-FundBoardContact"
            >
              updates and news.
            </a>
          </li>
          <li className="mb-2">
            Or follow us on Twitter:&nbsp;
            <a
              href="https://twitter.com/teamfundboard"
              target="_blank"
              rel="noopener noreferrer"
            >
              @FundBoard.
            </a>
          </li>
        </ul>
        <hr className="mb-4" />
        <div className="mb-4">
          <h3>More</h3>
          <div className="mb-2">
            <a
              href="https://www.fundboard.co/terms-of-service"
              target="_blank"
              rel="noopener noreferrer"
              data-track="TalkLink-terms"
            >
              Our terms of service
            </a>
          </div>
          <div className="mb-2">
            <a
              href="https://www.fundboard.co/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              data-track="TalkLink-privacy"
            >
              Our privacy policy
            </a>
          </div>
        </div>
      </Col>
    </Row>
  );
}
