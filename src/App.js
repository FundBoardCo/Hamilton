import React from 'react';
import { BrowserRouter as Router, Route, NavLink, Redirect } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
  faCalculator,
  faChartLine,
  faCogs,
  faFileCsv,
  faFileExport,
  faFlag,
  faIndustry,
  faLink,
  faList,
  faMapMarkerAlt,
  faPlus,
  faPlusCircle,
  faRedoAlt,
  faSyncAlt,
  faToggleOn,
  faToggleOff,
} from '@fortawesome/free-solid-svg-icons';
import ScrollToTop from './components/ScrollToTop';
import Logo from './imgs/FundBoard_Logo.svg';
import Intro from './pages/start/Intro';
import Board from './pages/board/Board';
import Search from './pages/search/Search';

// import common icons so they're accessible later.
library.add(
  fab,
  faCalculator,
  faChartLine,
  faCogs,
  faFileCsv,
  faFileExport,
  faFlag,
  faIndustry,
  faLink,
  faList,
  faMapMarkerAlt,
  faPlus,
  faPlusCircle,
  faRedoAlt,
  faSyncAlt,
  faToggleOn,
  faToggleOff,
);

const newUser = true; //TODO: base this off of the redux state

function App() {
  return (
    <Router>
      <ScrollToTop>
        <Navbar expand="lg" className="fixed-top" id="Nav">
          <img id="NavLogo" src={Logo} alt="FundBoard Logo" />
          <span className="brandName">FundBoard</span>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto" defaultActiveKey={window.location.pathname}>
              <Nav.Link as={NavLink} href="/search" to="/search" activeClassName="active">Search</Nav.Link>
              <Nav.Link as={NavLink} href="/board" to="/board">Board</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <main className="container-xl" id="MainContainer">
          <Route path="/" exact>
            {newUser ? <Redirect to="/intro" /> : <Board/>}
          </Route>
          <Route path="/board" component={Board} />
          <Route path="/search" component={Search} />
        </main>
      </ScrollToTop>
    </Router>
  );
}

export default App;
