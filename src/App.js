import React from 'react';
import Timer from './Components/timer.js';
import { Row } from "react-bootstrap";
import './App.css';

function App() {
  return (
    <div>
      <div id="simplict">   
          <Row>
            <Timer />
          </Row>
      </div>
    </div>
  );
}

export default App;
