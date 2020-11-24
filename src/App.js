import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Switch,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import {
  faArchive,
  faBalanceScale,
  faBan,
  faBuilding,
  faCaretDown,
  faCaretLeft,
  faCaretUp,
  faCaretRight,
  faCheck,
  faCheckCircle,
  faCog,
  faComment,
  faCommentDots,
  faComments,
  faDoorOpen,
  faEdit,
  faEllipsisH,
  faExclamationTriangle,
  faEye,
  faEyeSlash,
  faFileCsv,
  faFileDownload,
  faFileExport,
  faFlag,
  faHandsHelping,
  faInfoCircle,
  faKey,
  faLink,
  faList,
  faMapMarkerAlt,
  faMinus,
  faMinusCircle,
  faMoneyCheck,
  faPlus,
  faPlusCircle,
  faProjectDiagram,
  faRocket,
  faSearch,
  faSignInAlt,
  faStar,
  faThumbsDown,
  faThumbsUp,
  faTimes,
  faUser,
  faUsers,
  faQuestion,
  faQuestionCircle,
  faWifi,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'react-datepicker/dist/react-datepicker.css';
import Logo from './imgs/FundBoard_Logo.svg';
import ScrollToTop from './components/ScrollToTop';
import Intro from './pages/start/Intro';
import IntroSearch from './pages/start/IntroSearch';
import Board from './pages/board/Board';
import Search from './pages/search/Search';
import Profile from './pages/profile/Profile';
import Talk from './pages/talk/Talk';
import Public from './pages/public/Public';
import NotFound from './pages/NotFound';
import Modal from './modals/ModalWrapper';
import * as types from './actions/types';

// import common icons so they're accessible later.
library.add(
  fab,
  faArchive,
  faBalanceScale,
  faBan,
  faBuilding,
  faCaretDown,
  faCaretLeft,
  faCaretUp,
  faCaretRight,
  faCheck,
  faCheckCircle,
  faCog,
  faComment,
  faCommentDots,
  faComments,
  faDoorOpen,
  faEdit,
  faFileDownload,
  faEllipsisH,
  faExclamationTriangle,
  faEye,
  faEyeSlash,
  faFileCsv,
  faFileExport,
  faFlag,
  faHandsHelping,
  faInfoCircle,
  faKey,
  faLink,
  faList,
  faMapMarkerAlt,
  faMinus,
  faMinusCircle,
  faMoneyCheck,
  faPlus,
  faPlusCircle,
  faProjectDiagram,
  faRocket,
  faSearch,
  faSignInAlt,
  faStar,
  faThumbsDown,
  faThumbsUp,
  faTimes,
  faUser,
  faUsers,
  faQuestion,
  faQuestionCircle,
  faWifi,
);

function App() {
  const loggedIn = useSelector(state => state.user.token);
  const firstTime = useSelector(state => state.search.firstTime);

  const dispatch = useDispatch();

  const onShowLogin = () => dispatch({
    type: types.MODAL_SET_OPEN,
    modal: 'login',
  });

  return (
    <Router>
      <ScrollToTop>
        <Navbar className="nav">
          <a href="/" className="navBrand">
            <img className="navLogo" src={Logo} alt="FundBoard Logo" />
            <span className="navName">FundBoard</span>
            <span className="navVersion">Alpha 0.1.12</span>
          </a>
          <Nav className="ml-auto" defaultActiveKey={window.location.pathname}>
            {(!firstTime || loggedIn) && (
              <Nav.Link
                as={NavLink}
                href="/board"
                to="/board"
                className="board"
                data-track="navBoard"
              >
                <FontAwesomeIcon icon="list" />
                <span>My FundBoard</span>
              </Nav.Link>
            )}
            {(!firstTime || loggedIn) && (
              <Nav.Link
                as={NavLink}
                href="/search/menu"
                to="/search/menu"
                className="search"
                activeClassName="active"
                data-track="navSearch"
              >
                <FontAwesomeIcon icon="search" />
                <span>Search</span>
              </Nav.Link>
            )}
            {loggedIn && (
              <Nav.Link
                as={NavLink}
                href="/profile"
                to="/profile"
                className="profile"
                activeClassName="profile"
                data-track="navProfile"
              >
                <FontAwesomeIcon icon="user" />
                <span>My Profile</span>
              </Nav.Link>
            )}
            {(!firstTime || loggedIn) && (
            <Nav.Link
              as={NavLink}
              href="/talk"
              to="/talk"
              className="talk"
              activeClassName="talk"
              data-track="navTalk"
            >
              <FontAwesomeIcon icon="comment-dots" />
              <span>Talk to Us</span>
            </Nav.Link>
            )}
            {!loggedIn && (
              <Button
                variant="link"
                className="login navbar-btn"
                onClick={onShowLogin}
                data-track="navLogin"
              >
                <FontAwesomeIcon icon="sign-in-alt" />
                <span>Log In</span>
              </Button>
            )}
          </Nav>
        </Navbar>
        <main id="Main">
          <div className="container-xl">
            <Switch>
              <Route path="/" exact component={Intro} />
              <Route path="/intro" component={Intro} />
              <Route path="/introsearch" component={IntroSearch} />
              <Route path="/board" component={Board} />
              <Route path="/search" component={Search} />
              <Route path="/profile" component={Profile} />
              <Route path="/talk" component={Talk} />
              <Route path="/public/:uuid" component={Public} />
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
