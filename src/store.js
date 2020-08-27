import {createStore, applyMiddleware, combineReducers} from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';
import airtable from './reducers/airtable';
import board from './reducers/board';
import info from './reducers/info';
import search from './reducers/search';
import user from './reducers/user';
import modal from './reducers/modal';
import people from './reducers/people';
import rootSaga from './sagas';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['search'],
};

const searchConfig = {
  key: 'search',
  storage,
  blacklist: ['results'],
};

const rootReducer = combineReducers({
  airtable,
  board,
  info,
  modal,
  people,
  search: persistReducer(searchConfig, search),
  user,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const sagaMiddleware = createSagaMiddleware();
export const store = createStore(persistedReducer, applyMiddleware(sagaMiddleware));
export const persistor = persistStore(store);

export default store;

sagaMiddleware.run(rootSaga);
