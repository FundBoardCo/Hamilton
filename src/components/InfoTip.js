import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function InfoTip(props) {
  const { itemId, collection } = props;
  const item = useSelector(state => state.info[itemId]) || {};
  const { data = {} } = item;
  console.log(data);
  console.log(item);

  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: 'INFO_GET_REQUEST',
      params: { itemId, collection },
    });
  }, [dispatch, itemId, collection]);

  const toggleTip = () => {
    setOpen(!open);
  };

  const infoBody = (
    <Popover id={itemId} className="infoTipBody">
      <Popover.Content>
        <h3>{data.name || ''}</h3>
      </Popover.Content>
    </Popover>
  );

  return (
    <OverlayTrigger
      trigger="click"
      overlay={infoBody}
      placement="bottom"
    >
      <button
        type="button"
        className={`infoTip ${open ? 'open' : ''}`}
        onClick={toggleTip}
      >
        <FontAwesomeIcon icon="info-circle" />
      </button>
    </OverlayTrigger>
  );
}

InfoTip.defaultProps = {
  itemId: '',
  collection: '',
};

InfoTip.propTypes = {
  itemId: PropTypes.string,
  collection: PropTypes.string,
};
