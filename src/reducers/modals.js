import * as types from '../actions/types';

export default function modals(state = {}, action) {
  //TODO: toggle for person, etc.
  switch (action.type) {
    case types.MODAL_ORG_TOGGLE: return {
      ...state,
      orgIsOpen: !action.params || action.params.open === undefined
        ? !state.orgIsOpen : action.params.open,
      orgName: action.params.name,
      orgKey: action.params.key,
    };
    default: return state;
  }
}
