import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import "./statistics.css";

class Stats extends React.Component {
  constructor() {
    super();
    this.state = {
      record: [0],
      ao5: 0,
      ao12: 0,
      ao50: 0,
      best: 0,
      worst: 0,
      session_average: "",
      session_mean: "",
    };

    this.avg_of_5 = this.avg_of_5.bind(this)
    this.avg_of_12 = this.avg_of_12.bind(this)
    this.avg_of_50 = this.avg_of_50.bind(this)
    this.stringToInt = this.stringToInt.bind(this)
    this.clearRecord = this.clearRecord.bind(this)
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleWindowSizeChange);
    window.addEventListener("spacebar", this.handleSpace, true);
    setInterval(() => this.setState({
      ao5: this.avg_of_5(),
      ao12: this.avg_of_12(),
      ao50: this.avg_of_50()
    }), 1000)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowSizeChange);
    window.removeEventListener("spacebar", this.handleSpace, true);
  }

  stringToInt(array) {
    return array.map(Number);
  }

  avg_of_5() {
    if (this.props.record.length >= 5) {
      var i = this.props.record.length - 1;
      var solves = []
      for (var x = i; (i - x) < 5; x--) {
        solves = solves.concat(this.props.record[x])
      }
      this.setState({ record: solves })
      this.state.record.sort(function (a, b) { return a - b });
      this.setState({
        best: this.state.record.shift(),
        worst: this.state.record.pop(),
        ao5: ((this.stringToInt(this.state.record).reduce((a, b) => a + b, 0)) / 3).toFixed(2),
      });
    }

    return this.state.ao5;
  }

  avg_of_12() {
    if (this.props.record.length >= 12) {
      var i = this.props.record.length - 1;
      var solves = []
      for (var x = i; (i - x) < 12; x--) {
        solves = solves.concat(this.props.record[x])
      }
      this.setState({ record: solves })
      this.state.record.sort(function (a, b) { return a - b });
      this.setState({
        best: this.state.record.shift(),
        worst: this.state.record.pop(),
        ao12: ((this.stringToInt(this.state.record).reduce((a, b) => a + b, 0)) / 10).toFixed(2),
      });
    }

    return this.state.ao12;
  }

  avg_of_50() {
    if (this.props.record.length >= 50) {
      var i = this.props.record.length - 1;
      var solves = []
      for (var x = i; (i - x) < 50; x--) {
        solves = solves.concat(this.props.record[x])
      }
      this.setState({ record: solves })
      this.state.record.sort(function (a, b) { return a - b });
      this.setState({
        best: this.state.record.shift(),
        worst: this.state.record.pop(),
        ao50: ((this.stringToInt(this.state.record).reduce((a, b) => a + b, 0)) / 48).toFixed(2),
      });
    }

    return this.state.ao50;
  }

  clearRecord() {
    this.props.clearRecord();
    this.setState({
      ao5: "",
      ao12: "",
      ao50: "",
      best: "",
      worst: "",
    })
  }

  render() {
    return (
      <React.Fragment>
        <div id="avg-container">
          
          <p id="avg-text">  </p>
          <p id="avg-text"> ao5: {this.state.ao5} </p>
          <p id="avg-text"> ao12: {this.state.ao12}</p>
          <p id="avg-text"> ao50: {this.state.ao50} </p>
        </div>
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
                {this.props.record}
              </Col>
              <Col md={4} id="main_stats">
                <p> Session Best: {this.state.best} </p>
                <p> Session Worst: {this.state.worst} </p>
                <p> Session Average:  </p>
                <p> Session Mean:  </p>
                <Button variant="outline-dark" onClick={this.clearRecord}> Reset </Button>
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
      </React.Fragment>
    );
  }

}

export default Stats;