import React, {useCallback, useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Search() {
  const keywords = useSelector(state => state.search.keywords) || [];
  const airtableKeywords = useSelector(state => state.airtable.keywords) || {};
  const wordsToShow = Array.isArray(airtableKeywords.data) ? airtableKeywords.data : [];
  const dispatch = useDispatch();

  const getKeywords = useCallback((() => dispatch({
    type: 'AIRTABLE_GET_KEYWORDS_REQUESTED',
  })), [dispatch]);

  useEffect(() => {
    if(!Array.isArray(airtableKeywords.data) && !airtableKeywords.state) getKeywords();
  });

  const setKeywords = useCallback(((keywords) => dispatch({
    type: 'SEARCH_SET_KEYWORDS',
    keywords,
  })));

  const onTileClick = (word, active) => {
    if(active) {
      setKeywords(keywords.filter(w => w !== word));
    } else {
      setKeywords([...keywords, word]);
    }
  };

  return (
    <Row id="Keywords">
      <Col className="keywordsInner">
        <h1 className="text-center">We Are</h1>
        <div className='tiles'>
          {wordsToShow.map(w => {
            const active = keywords.includes(w);
            return (
              <div
                className={`tile ${active ? 'active' : ''}`}
                onClick={() => onTileClick(w, active)}
                key={w}
              >
                {w}
              </div>
            )
          })}
        </div>
      </Col>
    </Row>
  );
}
