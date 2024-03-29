import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import refresh from '../../Assets/Refresh_icon.png';
import "./Statistics.css";

class Stats extends React.Component {
  constructor() {
    super();
    this.state = {
      record: [],
      ao5: 0,
      ao12: 0,
      best: 0,
      worst: 0,
      session_average: 0,
      session_mean: 0,
      full_record: [],
      x_axis: [],
    };

    this.avg_of_5 = this.avg_of_5.bind(this)
    this.avg_of_12 = this.avg_of_12.bind(this)
    this.stringToInt = this.stringToInt.bind(this)
    this.clearRecord = this.clearRecord.bind(this)
    this.getBest = this.getBest.bind(this)
    this.getWorst = this.getWorst.bind(this)
    this.getSessionAvg = this.getSessionAvg.bind(this)
    this.deleteLastSolve = this.deleteLastSolve.bind(this)
    this.generateX = this.generateX.bind(this)
  }

  componentDidMount() {
    window.addEventListener("spacebar", this.handleSpace, true);
    window.addEventListener("resize", this.handleWindowSizeChange);
  }

  componentDidUpdate(prevProps) {
    if(prevProps.record.length !== this.props.record.length){
      this.setState({
        ao5: this.avg_of_5(),
        ao12: this.avg_of_12(),
        best: this.getBest(),
        worst: this.getWorst(),
        session_average: this.getSessionAvg(),
        session_mean: this.getSessionMean(),
        x_axis: this.generateX(),
      })
    }
  }

  componentWillUnmount() {
    window.removeEventListener("spacebar", this.handleSpace, true);
  }


  stringToInt(array) {
    return array.map(Number);
  }

  generateX() {
    var labels = []
    for (var i = 1; i <= this.props.record.length; i++) {
      labels = labels.concat(i);
    }

    return labels;
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

      this.setState({record: solves});
      solves.sort(function (a, b) { return a - b });
      solves.shift();
      solves.pop();

      return ((this.stringToInt(solves).reduce((a, b) => a + b, 0)) / 3).toFixed(2);

    }
  }

  avg_of_12() {
    if (this.props.record.length >= 12) {
      var i = this.props.record.length - 1;
      var solves = []
      for (var x = i; (i - x) < 12; x--) {
        solves = solves.concat(this.props.record[x])
      }

      this.setState({record: solves});
      solves.sort(function (a, b) { return a - b });
      solves.shift();
      solves.pop();

      return ((this.stringToInt(solves).reduce((a, b) => a + b, 0)) / 10).toFixed(2)
    }
  }

 

  getSessionAvg() {
    var session = []
    if (this.props.record.length >= 3) {
      session = session = session.concat(this.props.record);
      session.sort(function (a, b) { return a - b });

      session.shift();
      session.pop();

    }

    return ((this.stringToInt(session).reduce((a, b) => a + b, 0)) / (this.props.record.length - 2)).toFixed(2);
  }

  getSessionMean() {
    var session = []
    if (this.props.record.length > 0) {
      session = session = session.concat(this.props.record);
      session.sort(function (a, b) { return a - b });
    }

    return ((this.stringToInt(session).reduce((a, b) => a + b, 0)) / this.props.record.length).toFixed(2);
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

  deleteLastSolve() {
    console.log("Delete last solve called");
    this.props.record.pop();
    this.setState({ record: this.props.record})
  }

  toggleDashboard() {
    var x = document.getElementById("dashboard");
    if (x.style.display === "none") {
      x.style.display = "flex";
    } else {
      x.style.display = "none";
    }
  }

  render() {
    const chartOptions={
      // maintainAspectRatio: true,
      responsive: true,
      height: "10rem",
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }

    const chartData = {
      labels: this.state.x_axis,
      datasets: [
        {
          label: 'Solve Times',
          fill: false,
          lineTension: 0.5,
          backgroundColor: '#FFFFFF',
          borderColor: '#483d8b',
          borderWidth: 1,
          data: this.props.record
        }
      ]
    }
      return (
        <div id="stats">
          <div id="avg-container">
            <p id="avg-text"> Average of 5: {this.state.ao5} </p>
            <p id="avg-text"> Average of 12: {this.state.ao12}</p>
          </div>
          <Button variant="outline-dark" id="toggle-button" onClick={this.toggleDashboard}>Dashboard</Button>
          <Row id="dashboard">
            <Col lg={2} md={12} xs={12} id="stats_section">
              <Row>
                <Col lg={12} md={12} xs={12}>
                  <p id="dashboard_header">Session Summary</p>
                  <div id="main_stats">
                    <div> <strong>Session Best:</strong> {this.state.best} </div>
                    <div> <strong>Session Worst:</strong> {this.state.worst} </div>
                    <div> <strong>Session Average:</strong>  {this.state.session_average}</div>
                    <div> <strong>Session Mean</strong> {this.state.session_mean} </div>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col lg={5} md={12} xs={12} id="data_section">
              <Row>
                <Col lg={4} md={12} xs={12}>
                  <p id="dashboard_header">Session Data</p>
                  <p id="main_stats">All individual times recorded for this session.</p>
                  <Button variant="outline-dark" id="reset-button" onClick={this.deleteLastSolve}> Delete Last </Button>
                  <Button variant="outline-dark" id="reset-button" onClick={this.clearRecord}>Reset</Button>
                </Col>
                <Col lg={8} md={12} xs={12} id="recorded_times">
                  {this.props.record}
                </Col>
              </Row>
            </Col>
            <Col lg={5} md={12} xs={12} id="chart_section">
              <Row>
                <Col lg={4} md={12} xs={12}>
                <p id="dashboard_header">Session Chart</p>
                <p id="main_stats">Recorded times plotted on a chart for easier visualization.</p>
                </Col>
                <Col lg={8} md={12} xs={12}>
                  <Line data={chartData}
                  width={5}
                  height={2}
                  options={chartOptions}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      );
    }
}

export default Stats;