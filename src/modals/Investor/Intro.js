import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';
import { aFormDate } from '../../utils';

export default function Intro(props) {
  const {
    uuid,
    label,
    intro_date,
    intro_name,
    intro_email,
    onClick,
    onDelete,
  } = props;

  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  return (
    <div>
      <div className="d-flex mb-2">
        <div className="flex-grow-1">
          <div className="mb-1">{intro_name || label}</div>
          <div className="mb-1">
            <a href={`mailto://${intro_email}`}>
              {intro_email}
            </a>
          </div>
          <div className="mb-1">
            {intro_date && `On ${aFormDate(intro_date)}`}
          </div>
        </div>
        <div className="d-flex flex-column align-items-center">
          <button
            className="btn iconBtn text-primary mb-3"
            type="button"
            onClick={() => onClick(uuid)}
          >
            <FontAwesomeIcon icon="edit" className="txs-2" />
          </button>
          <button
            className="btn iconBtn text-primary"
            type="button"
            onClick={() => setShowDeleteWarning(true)}
          >
            <FontAwesomeIcon icon="trash-alt" className="txs-2" />
          </button>
        </div>
      </div>
      {showDeleteWarning && (
        <div className="d-flex align-items-center text-secondary pb-2 border-bottom bd-secondary txs-2">
          <span className="mr-auto">
            Delete Intro: This cannot be undone, are you sure?
          </span>
          <Button
            variant="outline-secondary txs-2 mr-2"
            onClick={() => setShowDeleteWarning(false)}
          >
            Nevermind
          </Button>
          <Button
            variant="outline-warning txs-2"
            onClick={() => onDelete(uuid)}
          >
            Yes, Delete It
          </Button>
        </div>
      )}
    </div>
  );
}

Intro.defaultProps = {
  uuid: '',
  label: '',
  intro_date: '',
  intro_name: '',
  intro_email: '',
  onClick: {},
  onDelete: {},
};

Intro.propTypes = {
  uuid: PropTypes.string,
  label: PropTypes.string,
  intro_date: PropTypes.string,
  intro_name: PropTypes.string,
  intro_email: PropTypes.string,
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
};
