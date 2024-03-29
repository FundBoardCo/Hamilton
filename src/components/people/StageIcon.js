import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { STAGEPROPS } from '../../constants';

export default function StageIcon(props) {
  const { current, withText } = props;
  let { stage } = props;
  stage = stage || 'none';

  let bkclr = 'bg-primary-light2';
  if (current) bkclr = 'bg-secondary';
  if (stage === 'none') {
    bkclr = 'bg-primary-light6';
  }

  return (
    <div className={`stageIcon iconDisc ${bkclr}`}>
      <FontAwesomeIcon icon={STAGEPROPS[stage].faIcon} />
      {withText && <span className="sr-only">{STAGEPROPS[stage].text}</span> }
    </div>
  );
}

StageIcon.defaultProps = {
  stage: '',
  current: false,
  withText: false,
};

StageIcon.propTypes = {
  stage: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  current: PropTypes.bool,
  withText: PropTypes.bool,
};
