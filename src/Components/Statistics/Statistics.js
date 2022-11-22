import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
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
      width: window.innerWidth,
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
    this.handleWindowSizeChange = this.handleWindowSizeChange.bind(this)
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

  // componentWillUnmount() {
  //   window.removeEventListener("spacebar", this.handleSpace, true);
  //   window.removeEventListener("resize", this.handleWindowSizeChange);
  // }

  handleWindowSizeChange(){
    this.setState({ width: window.innerWidth});
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

      this.setState({ session_average: ((this.stringToInt(session).reduce((a, b) => a + b, 0)) / (this.props.record.length - 2)).toFixed(2) });
    }
    else {
      // this.setState({ session_average: "" })
    }


    return this.state.session_average;
  }

  getSessionMean() {
    var session = []
    if (this.props.record.length > 0) {
      session = session = session.concat(this.props.record);
      session.sort(function (a, b) { return a - b });

      this.setState({ session_mean: ((this.stringToInt(session).reduce((a, b) => a + b, 0)) / this.props.record.length).toFixed(2) })
    }
    else {
      // this.setState({ session_mean: "" });
    }

    return this.state.session_mean;
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

  render() {

    const graph = {
      labels: this.state.x_axis,
      datasets: [
        {
          label: 'Solve Times',
          fill: false,
          lineTension: 0.5,
          backgroundColor: '#FFFFFF',
          borderColor: '#939393',
          borderWidth: 1,
          data: this.props.record
        }
      ]
    }

    const width = this.state.width;
    const isTablet = width <= 768 && width > 480;
    const isMobile = width <= 480;
    const isSmall_Desktop = width > 768 && width < 1400;

    if (isMobile) {
      return (
        <React.Fragment>
          <div id="avg-container">
            <p id="avg-text"> ao5: {this.state.ao5} </p>
            <p id="avg-text"> ao12: {this.state.ao12}</p>
          </div>
          <Row id="dashboard">
            <Col md={6} xs={12} id="s_section">
              <p> Statistics </p>
              <Row>
                <Col xs={6}  id="recorded_times">
                  {this.props.record}
                </Col>
                <Col xs={6} id="main_stats">
                  <p> Session Best: {this.state.best} </p>
                  <p> Session Worst: {this.state.worst} </p>
                  <p> Session Average:  {this.state.session_average}</p>
                  <p> Session Mean: {this.state.session_mean} </p>
                  <Button variant="outline-dark" id="reset-button" onClick={this.deleteLastSolve}> X </Button>
                  <Button variant="outline-dark" id="reset-button" onClick={this.clearRecord}> Reset All </Button>
                </Col>
              </Row>
            </Col>
            <Col md={6} xs={12} id="chart_section">
              <p> Performance Data </p>
              <Line data={graph}
                width={2}
                height={1}
                options={{
                  maintainAspectRatio: true,
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
    else if (isTablet) {
      return (
        <React.Fragment>
          <div id="avg-container">
            <p id="avg-text"> ao5: {this.state.ao5} </p>
            <p id="avg-text"> ao12: {this.state.ao12}</p>
          </div>
          <Row id="dashboard">
            <Col md={6} xs={12} id="s_section">
              <p> Statistics </p>
              <Row>
                <Col md={8} xs={6} id="recorded_times">
                  {this.props.record}
                </Col>
                <Col md={4} xs={6} id="main_stats">
                  <p> Session Best: {this.state.best} </p>
                  <p> Session Worst: {this.state.worst} </p>
                  <p> Session Average:  {this.state.session_average}</p>
                  <p> Session Mean: {this.state.session_mean} </p>
                  <Button variant="outline-dark" id="reset-button" onClick={this.deleteLastSolve}> X </Button>
                  <Button variant="outline-dark" id="reset-button" onClick={this.clearRecord}> Reset All </Button>
                </Col>
              </Row>
            </Col>
            <Col md={6} xs={12} id="chart_section">
              <p> Performance Data </p>
              <Line data={graph}
                width={4}
                height={2}
                options={{
                  maintainAspectRatio: true,
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
    else if(isSmall_Desktop){
      return (
        <React.Fragment>
          <div id="avg-container">
            <p id="avg-text"> ao5: {this.state.ao5} </p>
            <p id="avg-text"> ao12: {this.state.ao12}</p>
          </div>
          <Row id="dashboard">
            <Col md={6} xs={12} id="s_section">
              <p> Statistics </p>
              <Row>
                <Col md={8} xs={6} id="recorded_times">
                  {this.props.record}
                </Col>
                <Col md={4} xs={6} id="main_stats">
                  <p> Session Best: {this.state.best} </p>
                  <p> Session Worst: {this.state.worst} </p>
                  <p> Session Average:  {this.state.session_average}</p>
                  <p> Session Mean: {this.state.session_mean} </p>
                  <Button variant="outline-dark" id="reset-button" onClick={this.deleteLastSolve}> X </Button>
                  <Button variant="outline-dark" id="reset-button" onClick={this.clearRecord}> Reset All </Button>
                </Col>
              </Row>
            </Col>
            <Col md={6} xs={12} id="chart_section">
              <p> Performance Data </p>
              <Line data={graph}
                width={3}
                height={1}
                options={{
                  maintainAspectRatio: true,
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
    else {
      return (
        <React.Fragment>
          <div id="avg-container">
            <p id="avg-text"> ao5: {this.state.ao5} </p>
            <p id="avg-text"> ao12: {this.state.ao12}</p>
          </div>
          <Row id="dashboard">
            <Col md={6} xs={12} id="s_section">
              <p> Statistics </p>
              <Row>
                <Col md={8} id="recorded_times">
                  {this.props.record}
                </Col>
                <Col md={4} id="main_stats">
                  <p> Session Best: {this.state.best} </p>
                  <p> Session Worst: {this.state.worst} </p>
                  <p> Session Average:  {this.state.session_average}</p>
                  <p> Session Mean: {this.state.session_mean} </p>
                  <Button variant="outline-dark" id="reset-button" onClick={this.deleteLastSolve}> X </Button>
                  <Button variant="outline-dark" id="reset-button" onClick={this.clearRecord}> Reset All </Button>
                </Col>
              </Row>
            </Col>
            <Col md={6} xs={12} id="chart_section">
              <p> Performance Data </p>
              <Line data={graph}
                width={5}
                height={1}
                options={{
                  maintainAspectRatio: true,
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

}

export default Stats;