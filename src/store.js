import { createStore, applyMiddleware, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';
import airtable from './reducers/airtable';
import board from './reducers/board';
import info from './reducers/info';
import search from './reducers/search';
import user, { userResets } from './reducers/user'
import modal from './reducers/modal';
import people from './reducers/people';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['search'],
};

const airtableConfig = {
  key: 'airtable',
  storage,
  blacklist: ['feedback_status'],
};

const boardConfig = {
  key: 'board',
  storage,
  blacklist: [],
};

const peopleConfig = {
  key: 'people',
  storage,
  blacklist: [],
};

const searchConfig = {
  key: 'search',
  storage,
  blacklist: ['results', 'results_status', 'extraZipcodes_status'],
};
const userConfig = {
  key: 'user',
  storage,
  blacklist: Object.keys(userResets),
};

const rootReducer = combineReducers({
  airtable: persistReducer(airtableConfig, airtable),
  board: persistReducer(boardConfig, board),
  info,
  modal,
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
