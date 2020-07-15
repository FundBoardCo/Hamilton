import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Investor from './Investor';
import SearchMenu from './SearchMenu';

export default function ModalWrapper() {
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
      <Route
        path="/board/:investor"
        component={Investor}
      />
    </Switch>
  );
}
