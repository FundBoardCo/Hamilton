import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InvestorNameTag from './InvestorNameTag';
import SelectableInvestorStage from '../../components/people/SelectableInvestorStage';
import * as types from '../../actions/types';
import DismissibleStatus from '../../components/DismissibleStatus';

export default function InvestorRaise(props) {
  const { uuid, data = {}, path } = props;

  const investorStatus = useSelector(state => state.manageRaise.records[uuid]);
  const { id, stage, notes, next, amount } = investorStatus;
  const postStatus = useSelector(state => state.manageRaise.post_status) || '';
  const [amountValue, setAmount] = useState(amount);

  const dispatch = useDispatch();

  const updateStatus = params => dispatch({
    type: types.USER_POST_INVESTORSTATUS_REQUESTED,
    params,
  });

  const onSaveAmount = () => {
    const params = {
      id,
      uuid,
      amount: amountValue,
    };
    updateStatus(params);
  };

  const showAmount = ['negotiating', 'invested', 'leading'].includes(stage);
  const amountText = stage === 'negotiating'
    ? 'You are Asking Them to Invest' : 'Amount They Invested';

  return (
    <div>
      <InvestorNameTag data={data} path={path} />
      <DismissibleStatus
        status={postStatus}
        showSuccess={false}
        dissmissAction={types.USER_POST_INVESTORSTATUS_DISMISSED}
      />
      <div className="mb-2">
        <SelectableInvestorStage uuid={uuid} />
      </div>
      {showAmount && (
        <div>
          <label htmlFor="raise-amount">{amountText}</label>
          <InputGroup className="mb-2">
            <InputGroup.Prepend>
              <InputGroup.Text>$</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              type="number"
              min={1000}
              step={1000}
              max={10000000000}
              value={amountValue}
              onChange={e => setAmount(Number(e.target.value))}
              aria-label="Amount (to the nearest dollar)"
            />
            <InputGroup.Append>
              <Button
                variant="secondary"
                onClick={onSaveAmount}
              >
                Save
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </div>
      )}
    </div>
  );
}

InvestorRaise.defaultProps = {
  uuid: '',
  data: {},
  path: '',
};

InvestorRaise.propTypes = {
  uuid: PropTypes.string,
  data: PropTypes.shape({
    params: PropTypes.objectOf(PropTypes
      .oneOfType([PropTypes.bool, PropTypes.string, PropTypes.objectOf(PropTypes.string)])),
  }),
  path: PropTypes.string,
};
