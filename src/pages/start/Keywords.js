import React, {useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Keywords() {
  const searchKeywords = useSelector(state => state.search.keywords) || [];
  const airtableKeywords = useSelector(state => state.airtable.keywords) || {};
  const wordsToShow = Array.isArray(airtableKeywords.data) ? airtableKeywords.data : [];
  const dispatch = useDispatch();

  const getKeywords = () => dispatch({
    type: 'AIRTABLE_GET_KEYWORDS_REQUESTED',
  });

  useEffect(() => {
    if (!Array.isArray(airtableKeywords.data) && !airtableKeywords.state) getKeywords();
  });

  const setKeywords = keywords => dispatch({
    type: 'SEARCH_SET_KEYWORDS',
    keywords,
  });

  const onTileClick = (word, active) => {
    if(active) {
      setKeywords(searchKeywords.filter(w => w !== word));
    } else {
      setKeywords([...searchKeywords, word]);
    }
  };

  return (
    <Row id="Keywords">
      <Col className="keywordsInner">
        <h1 className="text-center">We Are</h1>
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
              >
                {w}
              </button>
            );
          })}
        </div>
      </Col>
    </Row>
  );
}
