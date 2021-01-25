import React from 'react';
import Timer from './Components/timer.js';
import Scrambler from './Components/scrambler.js';
import { Row } from "react-bootstrap";
import './App.css';

function App() {
  return (
    <div>
      <div id="simplict">   
          {/* <Row>
            <Scrambler />
          </Row> */}
          <Row>
            <Timer />
          </Row>
      </div>
    </div>
  );
}

export default App;
