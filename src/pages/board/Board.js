import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useHistory } from 'react-router';

export default function Board() {
  const investors = useSelector(state => state.board.ids) || [];
  console.log(investors)

  const dispatch = useDispatch();

  const history = useHistory();

  return (
    <Row className="pageContainer">
      <Container fluid>
        <Row>
          <Col>
            <h1>My FundBoard</h1>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            Placeholder for board
          </Col>
        </Row>
      </Container>
    </Row>
  );
}
