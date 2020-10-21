import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InvestorNameTag from './InvestorNameTag';
import SelectableInvestorStage from '../../components/people/SelectableInvestorStage';
import * as types from '../../actions/types';
import DismissibleStatus from '../../components/DismissibleStatus';

export default function InvestorRaise(props) {
  const { uuid, data = {}, path } = props;

  const postStatus = useSelector(state => state.manageRaise.post_status) || '';

  const dispatch = useDispatch();

  return (
    <div>
      <InvestorNameTag data={data} path={path} />
      <DismissibleStatus
        status={postStatus}
        showSuccess={false}
        dissmissAction={types.USER_POST_INVESTORSTATUS_DISMISSED}
      />
      <SelectableInvestorStage uuid={uuid} />
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
