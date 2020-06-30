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
  faSignInAlt
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Logo from './imgs/FundBoard_Logo.svg';
import ScrollToTop from './components/ScrollToTop';
import Intro from './pages/start/Intro';
import Board from './pages/board/Board';
import Search from './pages/search/Search';
import Profile from './pages/profile/Profile';
import Login from './pages/profile/Login';
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
  faSignInAlt,
);

const loggedIn = false; //TODO: base this off of the redux state

function App() {
  return (
    <Router>
      <ScrollToTop>
        <Navbar id="Nav">
          <a href="/" id="NavBrand">
            <img id="NavLogo" src={Logo} alt="FundBoard Logo" />
            <span id="NavName">FundBoard</span>
            <span id="NavVersion">0.1</span>
          </a>
          <Nav className="ml-auto" defaultActiveKey={window.location.pathname}>
            {loggedIn &&
            <Nav.Link
              as={NavLink}
              href="/board"
              to="/board"
              className='board'
            >
              <FontAwesomeIcon icon="list"/>
              <span>My FundBoard</span>
            </Nav.Link>
            }
            {loggedIn &&
            <Nav.Link
              as={NavLink}
              href="/search"
              to="/search"
              className='search'
              activeClassName="active"
            >
              <FontAwesomeIcon icon="search"/>
              <span>Search</span>
            </Nav.Link>
            }
            {loggedIn &&
            <Nav.Link
              as={NavLink}
              href="/profile"
              to="/profile"
              className='profile'
              activeClassName="profile"
            >
              <FontAwesomeIcon icon="cog"/>
              <span>My Profile</span>
            </Nav.Link>
            }
            {!loggedIn &&
            <Nav.Link
              as={NavLink}
              href="/login"
              to="/login"
              className='login'
              activeClassName="login"
            >
              <FontAwesomeIcon icon="sign-in-alt"/>
              <span>Log In</span>
            </Nav.Link>
            }
          </Nav>
        </Navbar>
        <main className="container-xl" id="Main">
          <Switch>
            <Route path="/" exact>
              {loggedIn ?  <Redirect to="/board" /> : <Redirect to="/intro" />}
            </Route>
            <Route path="/intro" component={Intro} />
            <Route path="/board" component={Board} />
            <Route path="/search" component={Search} />
            <Route path="/profile" component={Profile} />
            <Route path="/login" component={Login} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </ScrollToTop>
    </Router>
  );
}

export default App;
