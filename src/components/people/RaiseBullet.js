import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

export default function RaiseBullet(props) {
  const {
    faIcon,
    text,
    bool,
    link,
  } = props;
  return (
    <li>
      <div className={`iconDisc ${bool ? 'bg-primary' : 'bg-warning-light3'}`}>
        <FontAwesomeIcon icon={faIcon} />
        {!bool && <FontAwesomeIcon icon="ban" className="iconDiscOverlay text-warning" />}
      </div>
      {link ? (
        <a
          href={link}
          className={bool ? 'text-primary' : 'text-warning'}
          target="_blank"
          rel="noopener noreferrer"
        >
          {text}
        </a>
      ) : (
        <span
          className={bool ? 'text-primary' : 'text-warning'}
        >
          {text}
        </span>
      )}
    </li>
  );
}

RaiseBullet.defaultProps = {
  faIcon: '',
  text: '',
  bool: false,
  link: '',
};

RaiseBullet.propTypes = {
  faIcon: PropTypes.string,
  text: PropTypes.string,
  bool: PropTypes.bool,
  link: PropTypes.string,
};
