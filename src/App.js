import React from 'react';
import Timer from './Components/timer.js';
import Scrambler from './Components/scrambler.js';
import Stats from './Components/statistics.js';
import { Row, Container, Col } from "react-bootstrap";
import './App.css';

function App() {
  return (
    <div>
      <div id="simplict">
        <Container>
          <Row>
            <Scrambler />
          </Row>
          <Row>
            <Timer />
          </Row>
          <Row>
            <Stats />
          </Row>
        </Container>
      </div>
      <div >
        <Row id="dashboard">
          <Col md={3} id="s_section">
            <p> Settings </p>
            <Row>
              <Col md={12} id="settings">
                <p> Inspection: </p>
                <p> Timing Style: </p>
                <p> Fullscreen during solve: </p>
                <p> Background theme:  </p>
              </Col>
            </Row>
          </Col>
          <Col md={6} id="s_section">
            <p> Statistics </p>
            <Row>
              <Col md={8} id="recorded_times">
                <p> 10.00 </p>
                <p> 10.00 </p>
                <p> 10.00 </p>
                <p> 10.00 </p>
                <p> 10.00 </p>
              </Col>
              <Col md={4} id="main_stats">
                <p> Session Best: </p>
                <p> Session Worst: </p>
                <p> Session Average:  </p>
                <p> Session Mean:  </p>
                <p> Standard Deviation: </p>
              </Col>
            </Row>
          </Col>
          <Col md={3}>
            <p> Scramble </p>
            <Row>
              <Col md={8} id="scramble_settings">
                <p> Cube Type </p>
                <p> Scramble Style </p>
              </Col>
              <Col md={4}>
                <p> image of cube </p>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default App;
