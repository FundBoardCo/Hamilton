import { createStore, applyMiddleware, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';
import airtable from './reducers/airtable';
import founders, { founderResets } from './reducers/founders';
import info from './reducers/info';
import investors, { investorsResets } from './reducers/investors';
import search, { searchResets } from './reducers/search';
import user, { userResets } from './reducers/user';
import modal from './reducers/modal';
import people, { peopleResets } from './reducers/people';
import manageRaise from './reducers/manageRaise';

const configDefaults = {
  storage,
};

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['search'],
};

const airtableConfig = {
  ...configDefaults,
  key: 'airtable',
  blacklist: ['feedback_status'],
};

const foundersConfig = {
  ...configDefaults,
  key: 'founders',
  blacklist: Object.keys(founderResets),
};

const investorsConfig = {
  ...configDefaults,
  key: 'investors',
  blacklist: Object.keys(investorsResets),
};

const manageRaiseConfig = {
  ...configDefaults,
  key: 'manageRaise',
  blacklist: [
    'records',
    'public_records',
    'manual_records',
    'get_status',
    'post_status',
    'publicPost_status',
    'postBoard_status',
    'getPublic_status',
    'postBoard_status',
    'deleteBoard_status',
    'getPublic_status',
    'getBoardUUID_status',
    'getFounderData_status',
    'manualInvestorGet_status',
    'manualInvestorPost_status',
  ],
};

const modalConfig = {
  ...configDefaults,
  key: 'modal',
};

const peopleConfig = {
  ...configDefaults,
  key: 'people',
  blacklist: Object.keys(peopleResets),
};

const searchConfig = {
  ...configDefaults,
  key: 'search',
  blacklist: Object.keys(searchResets),
};

const userConfig = {
  ...configDefaults,
  key: 'user',
  blacklist: Object.keys(userResets),
};

const rootReducer = combineReducers({
  airtable: persistReducer(airtableConfig, airtable),
  info,
  founders: persistReducer(foundersConfig, founders),
  investors: persistReducer(investorsConfig, investors),
  manageRaise: persistReducer(manageRaiseConfig, manageRaise),
  modal: persistReducer(modalConfig, modal),
  people: persistReducer(peopleConfig, people),
  search: persistReducer(searchConfig, search),
  user: persistReducer(userConfig, user),
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
const logger = ({ getState }) => next => action => {
  if (process.env.NODE_ENV === 'development' || process.env.REACT_APP_ENV === 'DEV') {
    window.console.log({ previous: getState(), action, type: action.type });
  }
  next(action);
};

const sagaMiddleware = createSagaMiddleware();
export const store = createStore(persistedReducer, applyMiddleware(sagaMiddleware, logger));
export const persistor = persistStore(store);

export default store;

sagaMiddleware.run(rootSaga);
