import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import RangeSlider from 'react-bootstrap-range-slider';

export default function Raise() {
  const storedRaise = useSelector(state => state.search.raise) || 100000;
  const [raiseValue, setRaiseValue] = useState(storedRaise);

  const dispatch = useDispatch();

  const setRaise = raise => dispatch({
    type: 'SEARCH_SET_RAISE',
    raise,
  });

  const onRaiseChange = val => {
    setRaiseValue(val);
    setRaise(val);
  };

  const usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <Row id="Raise">
      <Col className="raiseInner">
        <h1 className="text-center">Raising</h1>
        <h2 className="text-center">{usdFormatter.format(raiseValue)}</h2>
        <div className="sliderWrapper">
          <RangeSlider
            value={raiseValue}
            min={100000}
            max={10000000}
            step={100000}
            size="lg"
            variant="primary"
            tooltip="on"
            onChange={e => onRaiseChange(Number(e.target.value))}
          />
        </div>
      </Col>
    </Row>
  );
}
