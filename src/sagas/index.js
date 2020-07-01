import {
  all,
  put,
  call,
  fork,
  takeLatest,
  takeEvery,
} from 'redux-saga/effects';
import axios from 'axios';
import {
  CRUNCHBASE_APIKEY,
  AIRTABLE_APIKEY,
  CBURL,
} from '../constants.js';
import { getSafeVar } from '../utils';


export default function* rootSaga() {
  //yield fork(watchOrgsSubmited);
}
