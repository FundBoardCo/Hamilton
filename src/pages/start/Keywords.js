import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Keywords() {
  const searchKeywords = useSelector(state => state.search.keywords) || [];
  const airtableKeywords = useSelector(state => state.airtable.keywords) || {};
  const wordsToShow = Array.isArray(airtableKeywords.data) ? airtableKeywords.data : [];

  const [showTileWarning, setShowTileWarning] = useState(false);

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

  const onTileClick = (word, active) => {
    if (active) {
      setKeywords(searchKeywords.filter(w => w !== word));
      setShowTileWarning(false);
    } else if (searchKeywords.length < 5) {
      setKeywords([...searchKeywords, word]);
      setShowTileWarning(false);
    } else {
      setShowTileWarning(true);
    }
  };

  return (
    <Row id="Keywords">
      <Col className="keywordsInner">
        <h1 className="text-center">
          We Are
        </h1>
        <p className="text-center">Choose up to 5 keywords that describe your startup.</p>
        <div className="tilesWrapper">
          <div className="tiles">
            {wordsToShow.map(w => {
              const active = searchKeywords.includes(w);
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
