import React from 'react';
import Timer from './Components/timer.js';
import Scrambler from './Components/scrambler.js';
import { Row, Container } from "react-bootstrap";
import './App.css';

function App() {
  return (
    <div id="simplict">
      <Container>
        <Row>
        <Scrambler />
        </Row>
        <Row>
        <Timer />
        </Row>
      </Container>
      
      
    </div>
  );
}

export default App;
