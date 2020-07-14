import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Investor from './Investor';

export default function ModalWrapper() {
  return (
    <Switch>
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
