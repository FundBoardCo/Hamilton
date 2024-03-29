import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import DismissibleStatus from '../../components/DismissibleStatus';
import * as types from '../../actions/types';

export default function Keywords() {
  const searchKeywords = useSelector(state => state.search.keywords) || [];
  const airtableKeywords = useSelector(state => state.airtable.keywords) || {};
  const airtabelKeywordsStatus = airtableKeywords.status;

  const [tileSearchFor, setTileSearchFor] = useState('');
  const [showTileWarning, setShowTileWarning] = useState(false);
  let wordsToShow = Array.isArray(airtableKeywords.data)
    ? airtableKeywords.data
    : [];
  if (tileSearchFor) {
    wordsToShow = wordsToShow.filter(w => (
      w.toLowerCase().includes(tileSearchFor.toLowerCase())
    ));
  }

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: 'AIRTABLE_GET_KEYWORDS_REQUESTED',
    });
  }, [dispatch]);

  const setKeywords = keywords => dispatch({
    type: 'SEARCH_SET_KEYWORDS',
    keywords,
  });

  const onRemoveKeyword = w => {
    setKeywords(searchKeywords.filter(kw => kw !== w));
  };

  const onTileClick = (word, active) => {
    const normalizedWord = word.toLowerCase();
    if (active) {
      setKeywords(searchKeywords.filter(w => w !== normalizedWord));
      setShowTileWarning(false);
    } else if (searchKeywords.length < 5) {
      setKeywords([...searchKeywords, normalizedWord]);
      setShowTileWarning(false);
    } else {
      setShowTileWarning(true);
    }
  };

  return (
    <Row id="Keywords">
      <Col className="keywordsInner">
        <h1 className="text-center">
          Your Startup
        </h1>
        <p className="text-center">Choose up to 5 keywords that describe your startup.</p>
        <DismissibleStatus
          status={airtabelKeywordsStatus}
          showSuccess={false}
          dissmissAction={types.AIRTABLE_GET_KEYWORDS_DISMISSED}
        />
        <div className="text-info mb-3 d-flex flex-wrap align-items-center flex-shrink-0">
          <span>Selected:&nbsp;</span>
          {searchKeywords.map(w => (
            <Button
              variant="link"
              className="text-info mr-2"
              onClick={() => onRemoveKeyword(w)}
              key={w}
            >
              {`${w} (x)`}
            </Button>
          ))}
        </div>
        <InputGroup className="mb-2 p-1">
          <FormControl
            type="text"
            value={tileSearchFor}
            placeholder="Search for a keyword"
            onChange={e => setTileSearchFor(e.target.value)}
            aria-label="Search for keyword to include in your search."
          />
        </InputGroup>
        <div className="tilesWrapper">
          <div className="tiles">
            {wordsToShow.map(w => {
              const active = searchKeywords.includes(w.toLowerCase());
              return (
                <button
                  className={`tile ${active ? 'active' : ''}`}
                  onClick={() => onTileClick(w, active)}
                  key={w}
                  tabIndex={0}
                  type="button"
                  data-track="IntroSearchKeyword"
                >
                  {w}
                </button>
              );
            })}
          </div>
          {showTileWarning && (
            <button
              id="TileWarning"
              type="button"
              onClick={() => setShowTileWarning(false)}
              data-track="IntroSearchTileWarningBtn"
            >
              You can only select 5 keywords. Deselect one if you want to change it.
            </button>
          )}
        </div>
      </Col>
    </Row>
  );
}
