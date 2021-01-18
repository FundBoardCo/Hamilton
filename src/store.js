import { createStore, applyMiddleware, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';
import airtable from './reducers/airtable';
import founders, { founderResets } from './reducers/founders';
import info from './reducers/info';
import investors, { investorsResets } from './reducers/investors';
import search from './reducers/search';
import user, { userResets } from './reducers/user';
import modal from './reducers/modal';
import people, { peopleResets } from './reducers/people';
import manageRaise from './reducers/manageRaise';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['search'],
};

const airtableConfig = {
  key: 'airtable',
  storage,
  stateReconciler: hardSet,
  blacklist: ['feedback_status'],
};

const foundersConfig = {
  key: 'founders',
  storage,
  blacklist: Object.keys(founderResets),
};

const investorsConfig = {
  key: 'investors',
  storage,
  blacklist: Object.keys(investorsResets),
};

const manageRaiseConfig = {
  key: 'manageRaise',
  storage,
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
  stateReconciler: autoMergeLevel2,
};

const modalConfig = {
  key: 'modal',
  storage,
  blacklist: [],
  stateReconciler: autoMergeLevel2,
};

const peopleConfig = {
  key: 'people',
  storage,
  blacklist: Object.keys(peopleResets),
  stateReconciler: autoMergeLevel2,
};

const searchConfig = {
  key: 'search',
  storage,
  blacklist: ['results', 'results_status', 'extraZipcodes_status'],
  stateReconciler: autoMergeLevel2,
};

const userConfig = {
  key: 'user',
  storage,
  blacklist: Object.keys(userResets),
  stateReconciler: autoMergeLevel2,
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

const sagaMiddleware = createSagaMiddleware();
export const store = createStore(persistedReducer, applyMiddleware(sagaMiddleware));
export const persistor = persistStore(store);

export default store;

sagaMiddleware.run(rootSaga);
