import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';
import { rootReducer, resetState } from './reducers';
import rootSaga from './sagas';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: Object.keys(resetState),
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const sagaMiddleware = createSagaMiddleware();
export const store = createStore(persistedReducer, applyMiddleware(sagaMiddleware));
export const persistor = persistStore(store);

export default store;

sagaMiddleware.run(rootSaga);
