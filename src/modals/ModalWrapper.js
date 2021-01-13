import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Investor from './Investor/Investor';
import SearchMenu from './SearchMenu';
import Login from './Login';
import HowToIntro from './HowToIntro';
import CreatingPublicBoard from './CreatingPublicBoard';
import MakeIntro from './MakeIntro';
import Founder from './Founder';
import EditManualInvestor from './EditManualInvestor';
import WaitList from './WaitList';
import { MINPLACE } from '../constants';

export default function ModalWrapper() {
  const loggedIn = useSelector(state => state.user.sessionToken);
  const place = useSelector(state => state.user.place);
  const allowIn = typeof place === 'number' && place <= MINPLACE;
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
      { !loggedIn && <Route path={['/board', '/profile']} component={Login} /> }
      { loggedIn && !allowIn && <Route path={['/board']} component={WaitList} /> }
      { !openModal && <Route path="/board/:uuid" component={Investor} /> }
      { openModal === 'login' && <Route path="/" component={Login} /> }
      { openModal === 'howToIntro' && <Route path="/board" component={HowToIntro} /> }
      { openModal === 'creatingPublicBoard' && (
        <Route path={['/board', '/profile']} component={CreatingPublicBoard} />
      )}
      { openModal === 'makeIntro' && <Route path="/public" component={MakeIntro} />}
      { openModal === 'founder' && <Route path="/public" component={Founder} />}
      { openModal === 'editInvestor' && <Route path="/board" component={EditManualInvestor} />}
    </Switch>
  );
}
