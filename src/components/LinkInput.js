import React from 'react';
import PropTypes from 'prop-types';
import { Form, Col } from 'react-bootstrap/';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LinkInput = props => {
  const {
    text,
    url,
    linkIndex,
    onLinkTextChange,
    onLinkURLChange,
    onLinkRemove,
  } = props;
  return (
    <Form.Row>
      <Col>
        <Form.Group controlId={`LinkTextInput-${linkIndex}`}>
          <Form.Label>Link Label</Form.Label>
          <Form.Control
            type="text"
            placeholder="A label for the link"
            value={text}
            onChange={e => onLinkTextChange(e.target.value, linkIndex)}
            data-track="ProfileLinkTextInput"
            isInvalid={!text && url}
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid Url.
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col>
        <Form.Group controlId={`LinkURLInput-${linkIndex}`}>
          <Form.Label>Link URL</Form.Label>
          <Form.Control
            type="url"
            placeholder="Enter URL, e.g. http://..."
            value={url}
            onChange={e => onLinkURLChange(e.target.value, linkIndex)}
            data-track="ProfileLinkURLInput"
            isInvalid={text && !url}
          />
          <Form.Control.Feedback type="invalid">
            Please enter a valid url.
          </Form.Control.Feedback>
        </Form.Group>
      </Col>
      <Col className="flex-grow-0">
        <button
          className="btn iconBtn text-secondary endOfRowWithLabelBtn"
          type="button"
          onClick={() => onLinkRemove(linkIndex)}
        >
          <FontAwesomeIcon icon="times" />
        </button>
      </Col>
    </Form.Row>
  );
};

LinkInput.defaultProps = {
  text: '',
  url: '',
  linkIndex: 0,
  onLinkTextChange: {},
  onLinkURLChange: {},
  onLinkRemove: {},
};

LinkInput.propTypes = {
  text: PropTypes.string,
  url: PropTypes.string,
  linkIndex: PropTypes.number,
  onLinkTextChange: PropTypes.func,
  onLinkURLChange: PropTypes.func,
  onLinkRemove: PropTypes.func,
};

export default LinkInput;
