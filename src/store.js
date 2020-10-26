import { createStore, applyMiddleware, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';
import airtable from './reducers/airtable';
import board from './reducers/board';
import info from './reducers/info';
import search from './reducers/search';
import user, { userResets } from './reducers/user'
import modal from './reducers/modal';
import people from './reducers/people';
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

const boardConfig = {
  key: 'board',
  storage,
  blacklist: [],
  stateReconciler: autoMergeLevel2,
};

const manageRaiseConfig = {
  key: 'manageRaise',
  storage,
  blacklist: ['results', 'get_status', 'post_status', 'editNoteParams'],
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
  blacklist: [],
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
  board: persistReducer(boardConfig, board),
  info,
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
