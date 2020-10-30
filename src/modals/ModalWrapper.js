import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Investor from './Investor/Investor';
import SearchMenu from './SearchMenu';
import Login from './Login';
import HowToIntro from './HowToIntro';
import CreatingPublicBoard from './CreatingPublicBoard';

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
        path="/search/:uuid"
        component={Investor}
      />
      { loggedIn
        ? <Route path="/board/:uuid" component={Investor} />
        : <Route path="/board" component={Login} />}
      { !loggedIn && <Route path="/profile" component={Login} /> }
      { openModal === 'login' && <Route path="/" component={Login} /> }
      { openModal === 'howToIntro' && <Route path="/" component={HowToIntro} /> }
      { openModal === 'creatingPublicBoard' && <Route path="/" component={CreatingPublicBoard} />}
    </Switch>
  );
}
