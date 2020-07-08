import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.scss';
import './css/react-bootstrap-range-slider.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Spinner from 'react-bootstrap/Spinner';
import { store, persistor } from './store';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={<Spinner />} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
