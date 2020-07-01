import React, { useCallback } from 'react';
import { useSelector, useDispatch } from "react-redux";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Search() {
  const keywords = useSelector(state => state.search.keywords) || [];
  const wordsToShow = [
    'AI',
    'Advertising',
    'Agriculture',
    'Airplane',
    'Air Travel',
    'Augmented Biology',
    'Augmented Reality',
    'Automation',
    'Automotive',
    'B2B',
    'B2C',
    'Biotechnology',
    'Blockchain',
    'Botanical',
    'C2C',
    'Cloud',
    'Consumer',
    'Content',
    'Crypto',
    'Cryptography',
    'Cybernetics',
    'Cybersecurity',
    'Data',
    'Database',
    'Decentralized',
    'AI',
    'Advertising',
    'Agriculture',
    'Airplane',
    'Air Travel',
    'Augmented Biology',
    'Augmented Reality',
    'Automation',
    'Automotive',
    'B2B',
    'B2C',
    'Biotechnology',
    'Blockchain',
    'Botanical',
    'C2C',
    'Cloud',
    'Consumer',
    'Content',
    'Crypto',
    'Cryptography',
    'Cybernetics',
    'Cybersecurity',
    'Data',
    'Database',
    'Decentralized',
    'AI',
    'Advertising',
    'Agriculture',
    'Airplane',
    'Air Travel',
    'Augmented Biology',
    'Augmented Reality',
    'Automation',
    'Automotive',
    'B2B',
    'B2C',
    'Biotechnology',
    'Blockchain',
    'Botanical',
    'C2C',
    'Cloud',
    'Consumer',
    'Content',
    'Crypto',
    'Cryptography',
    'Cybernetics',
    'Cybersecurity',
    'Data',
    'Database',
    'Decentralized',
    'AI',
    'Advertising',
    'Agriculture',
    'Airplane',
    'Air Travel',
    'Augmented Biology',
    'Augmented Reality',
    'Automation',
    'Automotive',
    'B2B',
    'B2C',
    'Biotechnology',
    'Blockchain',
    'Botanical',
    'C2C',
    'Cloud',
    'Consumer',
    'Content',
    'Crypto',
    'Cryptography',
    'Cybernetics',
    'Cybersecurity',
    'Data',
    'Database',
    'Decentralized',
  ];
  const dispatch = useDispatch();

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
