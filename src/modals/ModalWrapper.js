import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Investor from './Investor';
import SearchMenu from './SearchMenu';
import Login from './Login';
import { capitalizeFirstLetter } from '../utils';

export default function ModalWrapper() {
  const loggedIn = useSelector(state => state.user.token);
  const openModal = useSelector(state => state.modal.openModal);

  return (
    <Switch>
      <Route
        exact
        path="/search/menu"
        component={SearchMenu}
      />
      <Route
        path="/search/:investor"
        component={Investor}
      />
      { loggedIn
        ? <Route path="/board/:investor" component={Investor} />
        : <Route path="/board" component={Login} />}
      { !loggedIn && <Route path="/profile" component={Login} /> }
      { openModal === 'login' && <Route path="/" component={Login} /> }
    </Switch>
  );
}
