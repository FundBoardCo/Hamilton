import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

export default function RaiseBullet(props) {
  const { faIcon, text, bool } = props;
  return (
    <li>
      <div className={`iconDisc ${bool ? 'bg-primary' : 'bg-warning-light3'}`}>
        <FontAwesomeIcon icon={faIcon} />
        {!bool && <FontAwesomeIcon icon="ban" className="iconDiscOverlay text-warning" />}
      </div>
      <span className={bool ? 'text-primary' : 'text-warning'}>{text}</span>
    </li>
  );
}

RaiseBullet.defaultProps = {
  faIcon: '',
  text: '',
  bool: false,
};

RaiseBullet.propTypes = {
  faIcon: PropTypes.string,
  text: PropTypes.string,
  bool: PropTypes.bool,
};
