import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Redirect,
  Switch,
} from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
  faCog,
  faFileCsv,
  faFileExport,
  faFlag,
  faLink,
  faList,
  faMapMarkerAlt,
  faPlus,
  faPlusCircle,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Logo from './imgs/FundBoard_Logo.svg';
import ScrollToTop from './components/ScrollToTop';
import Intro from './pages/start/Intro';
import Board from './pages/board/Board';
import Search from './pages/search/Search';
import Profile from './pages/profile/Profile';
import NotFound from './pages/NotFound';

// import common icons so they're accessible later.
library.add(
  fab,
  faCog,
  faFileCsv,
  faFileExport,
  faFlag,
  faLink,
  faList,
  faMapMarkerAlt,
  faPlus,
  faPlusCircle,
  faSearch,
);

const newUser = false; //TODO: base this off of the redux state

function App() {
  return (
    <Router>
      <ScrollToTop>
        <Navbar id="Nav">
          <img id="NavLogo" src={Logo} alt="FundBoard Logo" />
          <span id="NavName">FundBoard</span>
          <span id="NavVersion">0.1</span>
          <Nav className="ml-auto" defaultActiveKey={window.location.pathname}>
            <Nav.Link
              as={NavLink}
              href="/board"
              to="/board"
              className='board'
            >
              <FontAwesomeIcon icon="list" />
              <span>My FundBoard</span>
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              href="/search"
              to="/search"
              className='search'
              activeClassName="active"
            >
              <FontAwesomeIcon icon="search" />
              <span>Search</span>
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              href="/profile"
              to="/profile"
              className='profile'
            >
              <FontAwesomeIcon icon="cog" />
              <span>My Profile</span>
            </Nav.Link>
          </Nav>
        </Navbar>
        <main className="container-xl" id="Main">
          <Switch>
            <Route path="/" exact>
              {newUser ? <Redirect to="/intro" /> : <Redirect to="/board" />}
            </Route>
            <Route path="/intro" component={Intro} />
            <Route path="/board" component={Board} />
            <Route path="/search" component={Search} />
            <Route path="/profile" component={Profile} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </ScrollToTop>
    </Router>
  );
}

export default App;
