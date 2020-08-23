import * as types from './types';

export function addToBoard(id = '') {
  return { type: types.BOARD_ADD, id };
}

export function removeFromBoard(id = '') {
  return { type: types.BOARD_REMOVE, id };
}
