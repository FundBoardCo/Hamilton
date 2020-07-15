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
  faBalanceScale,
  faCaretLeft,
  faCaretRight,
  faCog,
  faDoorOpen,
  faEdit,
  faExclamationTriangle,
  faFileCsv,
  faFileExport,
  faFlag,
  faKey,
  faLink,
  faList,
  faMapMarkerAlt,
  faPlus,
  faPlusCircle,
  faRocket,
  faSearch,
  faSignInAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Logo from './imgs/FundBoard_Logo.svg';
import ScrollToTop from './components/ScrollToTop';
import Intro from './pages/start/Intro';
import IntroSearch from './pages/start/IntroSearch';
import Board from './pages/board/Board';
import Search from './pages/search/Search';
import Profile from './pages/profile/Profile';
import Login from './pages/profile/Login';
import NotFound from './pages/NotFound';
import Modal from './modals/ModalWrapper';

// import common icons so they're accessible later.
library.add(
  fab,
  faBalanceScale,
  faCaretLeft,
  faCaretRight,
  faCog,
  faDoorOpen,
  faEdit,
  faExclamationTriangle,
  faFileCsv,
  faFileExport,
  faFlag,
  faKey,
  faLink,
  faList,
  faMapMarkerAlt,
  faPlus,
  faPlusCircle,
  faRocket,
  faSearch,
  faSignInAlt,
);

const loggedIn = false; //TODO: base this off of the redux state

function App() {
  return (
    <Router>
      <ScrollToTop>
        <Navbar className="nav">
          <a href="/" className="navBrand">
            <img className="navLogo" src={Logo} alt="FundBoard Logo" />
            <span className="navName">FundBoard</span>
            <span className="navVersion">0.1</span>
          </a>
          <Nav className="ml-auto" defaultActiveKey={window.location.pathname}>
            {loggedIn
            && (
              <Nav.Link
                as={NavLink}
                href="/board"
                to="/board"
                className="board"
              >
                <FontAwesomeIcon icon="list" />
                <span>My FundBoard</span>
              </Nav.Link>
            )}
            {loggedIn
            && (
              <Nav.Link
                as={NavLink}
                href="/search"
                to="/search"
                className="search"
                activeClassName="active"
              >
                <FontAwesomeIcon icon="search" />
                <span>Search</span>
              </Nav.Link>
            )}
            {loggedIn
            && (
              <Nav.Link
                as={NavLink}
                href="/profile"
                to="/profile"
                className="profile"
                activeClassName="profile"
              >
                <FontAwesomeIcon icon="cog" />
                <span>My Profile</span>
              </Nav.Link>
            )}
            {!loggedIn
            && (
              <Nav.Link
                as={NavLink}
                href="/login"
                to="/login"
                className="login"
                activeClassName="login"
              >
                <FontAwesomeIcon icon="sign-in-alt" />
                <span>Log In</span>
              </Nav.Link>
            )}
          </Nav>
        </Navbar>
        <main id="Main">
          <div className="container-xl">
            <Switch>
              <Route path="/" exact>
                {loggedIn ? <Redirect to="/board" /> : <Redirect to="/intro" />}
              </Route>
              <Route path="/intro" component={Intro} />
              <Route path="/introsearch" component={IntroSearch} />
              <Route path="/board" component={Board} />
              <Route path="/search" component={Search} />
              <Route path="/profile" component={Profile} />
              <Route path="/login" component={Login} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </main>
        <Modal />
      </ScrollToTop>
    </Router>
  );
}

export default App;
