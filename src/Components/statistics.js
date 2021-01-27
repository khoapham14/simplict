import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
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
    this.getBest = this.getBest.bind(this)
    this.getWorst = this.getWorst.bind(this)
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleWindowSizeChange);
    window.addEventListener("spacebar", this.handleSpace, true);
    setInterval(() => this.setState({
      ao5: this.avg_of_5(),
      ao12: this.avg_of_12(),
      ao50: this.avg_of_50(),
      best: this.getBest(),
      worst: this.getWorst(),
    }), 500)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowSizeChange);
    window.removeEventListener("spacebar", this.handleSpace, true);
  }

  stringToInt(array) {
    return array.map(Number);
  }

  getBest() {
    var session = [];
    session = session.concat(this.props.record);
    session.sort(function (a, b) { return a - b });

    return session.shift();
  }

  getWorst() {
    var session = [];
    session = session.concat(this.props.record);
    session.sort(function (a, b) { return a - b });

    return session.pop();
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
      this.state.record.shift();
      this.state.record.pop();

      this.setState({
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
      this.state.record.shift();
      this.state.record.pop();
      this.setState({
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
      this.state.record.shift();
      this.state.record.pop();
      this.setState({
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
      record: "",
    })
  }

  render() {

    const graph = {
      labels: ['1', '2', '3', '4', '5'],
      datasets: [
        {
          label: 'Solve Times',
          fill: false,
          lineTension: 0.5,
          backgroundColor: '#FFFFFF',
          borderColor: '#939393',
          borderWidth: 1,
          data: this.state.record
        }
      ]
    }

    return (
      <React.Fragment>
        <div id="avg-container">

          <p id="avg-text">  </p>
          <p id="avg-text"> ao5: {this.state.ao5} </p>
          <p id="avg-text"> ao12: {this.state.ao12}</p>
          <p id="avg-text"> ao50: {this.state.ao50} </p>
        </div>
        <Row id="dashboard">
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
                <Button variant="outline-dark" id="reset-button" onClick={this.clearRecord}> Reset </Button>
              </Col>
            </Row>
          </Col>
          <Col md={6} id="chart_section">
            <p> Performance Data </p>
            <Line data={graph}
              width={"30%"}
              height={"6%"}
              options={{ maintainAspectRatio: true,
                scales: {
                  yAxes: [{
                    ticks: {
                      beginAtZero: true
                    }
                  }]
                }
              }}
            />
          </Col>
        </Row>
      </React.Fragment>
    );
  }

}

export default Stats;