import * as types from '../actions/types';
import { processErr } from '../utils';

const defaults = {
  investorStatuses: [],
  get_status: '',
  post_status: '',
};

export default function manageRaise(state = { ...defaults }, action) {
  const records = {};
  const { data } = action;

  switch (action.type) {
    case types.USER_GET_INVESTORSTATUSES_REQUESTED: return {
      ...state,
      get_status: 'pending',
    };
    case types.USER_GET_INVESTORSTATUSES_SUCCEEDED:
      if (Array.isArray(data.records)) {
        data.records.forEach(r => {
          if (r.fields && r.fields.uuid) {
            records[r.fields.uuid] = { ...r.fields };
          }
        });
      }
      return {
        ...state,
        get_status: 'succeeded',
        records,
      };
    case types.USER_GET_INVESTORSTATUSES_FAILED: return {
      ...state,
      get_status: processErr(action.error),
    };
    case types.USER_GET_INVESTORSTATUSES_DISMISSED: return {
      ...state,
      get_status: '',
    };
    case types.USER_POST_INVESTORSTATUS_REQUESTED: return {
      ...state,
      post_status: 'pending',
    };
    case types.USER_POST_INVESTORSTATUS_SUCCEEDED:
      return {
        ...state,
        post_status: 'succeeded',
        records: {
          ...state.records,
          [action.params.uuid]: action.params.data,
        },
      };
    case types.USER_POST_INVESTORSTATUS_FAILED: return {
      ...state,
      post_status: processErr(action.error),
    };
    case types.USER_POST_INVESTORSTATUS_DISMISSED: return {
      ...state,
      post_status: '',
    };
    default: return state;
  }
}
