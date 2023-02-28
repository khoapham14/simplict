import React from 'react';
import Timer from './Components/Timer/Timer.js';
import { Row } from "react-bootstrap";
import './App.css';

function App() {
  return (

    <div id="simplict">
      <Row>
        <Timer />
      </Row>
    </div>

  );
}

export default App;
