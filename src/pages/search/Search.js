import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Spinner from 'react-bootstrap/Spinner';
import Person from '../../components/people/Person';
import { statusIsError } from '../../utils';

function SearchAlert(props) {
  const [showAlert, setShowAlert] = useState(statusIsError(true));
  const { message } = props;
  if (showAlert) {
    return (
      <Alert
        variant="danger"
        className="searchAlert"
        onClose={() => setShowAlert(false)}
        dismissible
      >
        <Alert.Heading>There was an error.</Alert.Heading>
        Error:&nbsp;
        {message}
      </Alert>
    );
  }
  return null;
}

export default function Search() {
  const searchKeywords = useSelector(state => state.search.keywords) || [];
  const searchRaise = useSelector(state => state.search.raise) || 100000;
  const searchLocation = useSelector(state => state.search.location) || '';
  const searchResults = useSelector(state => state.search.results) || [];
  const searchStatus = useSelector(state => state.search.results_status) || '';

  const [detailsOpen, setDetailsOpen] = useState(false);

  const usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  });

  const onDetailClick = () => {
    setDetailsOpen(!detailsOpen);
  };

  const history = useHistory();

  const onEditClick = () => {
    history.push('search/menu');
  };

  return (
    <Row id="PageSearch" className="pageContainer">
      <div className="searchDetailsBar">
        <div className="primaryDetails">
          <Button
            className="primaryDetailsLink"
            variant="text-light"
            onClick={onDetailClick}
            data-track="ToggleSearchDetails"
          >
            {`${Object.keys(searchResults).length} investors match`}
          </Button>
          <Button
            variant="primary-light"
            className="btnTn inlineBtn"
            onClick={onEditClick}
            data-track="EditSearch"
          >
            <FontAwesomeIcon icon="edit" />
            edit
          </Button>
        </div>
        <div className={`secondaryDetails ${detailsOpen ? '' : 'sr-only'}`}>
          <p>
            {`You searched for: ${searchKeywords.join()}`}
          </p>
          <p>
            {`Raise: ${usdFormatter.format(searchRaise)}`}
          </p>
          <p>
            {`Location: ${searchLocation}`}
          </p>
        </div>
      </div>
      {statusIsError(searchStatus) && (
        <SearchAlert message={searchStatus} />
      )}
      <div className="results">
        {searchStatus === 'pending' && (
          <Spinner animation="border" variant="info" />
        )}
        {Object.keys(searchResults).map(k => {
          const personProps = { ...searchResults[k] };
          personProps.uuid = k;
          const pKey = personProps.permalink || personProps.image_id;
          return (
            <Person key={pKey} {...personProps} />
          );
        })}
      </div>
    </Row>
  );
}

SearchAlert.defaultProps = {
  message: '',
};

SearchAlert.propTypes = {
  message: PropTypes.string,
};
