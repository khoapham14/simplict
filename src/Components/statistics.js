import React from 'react';
import { Button } from 'react-bootstrap';
import Timer from './timer.js';
import "./statistics.css";

class Stats extends React.Component {
  constructor() {
    super();
    this.state = {
      record: [ 0 ],
      avg5: 0,
      avg12: 0,
      avg50: 0,
      best: 0,
      worst: 0,
    };

    this.handleSpace = this.handleSpace.bind(this)
    this.avg_of_5 = this.avg_of_5.bind(this)
    this.stringToInt = this.stringToInt.bind(this)
    this.clearRecord = this.clearRecord.bind(this)

  }

  componentDidMount() {
    window.addEventListener("resize", this.handleWindowSizeChange);
    window.addEventListener("spacebar", this.handleSpace, true);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowSizeChange);
    window.removeEventListener("spacebar", this.handleSpace, true);
  }

  handleSpace(e) {
    if (e.keyCode === 32) {
      this.setState({ record: Timer.exportTime() });
    }
  }

  stringToInt(array) {
    return array.map(Number);
  }

  avg_of_5() {
    if (this.props.record.length >= 5) {
      var i = this.props.record.length - 1;
      var solves = []
      for (var x = 0; x <= 4; x++) {
        solves = solves.concat(this.props.record[x])
      }

      this.setState({ record: solves })
    }
    else {
      alert("Less than 5 solves");
    }

    this.state.record.sort(function (a, b) { return a - b });
    this.setState({
      best: this.state.record.shift(),
      worst: this.state.record.pop(),
      ao5: (this.stringToInt(this.state.record).reduce((a, b) => a + b, 0))/3,
    });

    alert(this.state.record);
  }

  avg_of_12() {

  }

  avg_of_50() {

  }

  clearRecord() {
    this.props.clearRecord();
    this.setState({
      ao5: "",
      ao12: "",
      ao50: "",
    })
  }

  render() {
    return (
      <div id="avg-container">
        <p id="avg-text"> {this.props.record} </p>
        <p id="avg-text" onClick={this.avg_of_5}> ao5: {this.state.ao5} </p>
        <p id="avg-text"> ao5: </p>
        <p id="avg-text"> ao5: </p>
        <Button onClick={this.clearRecord}> Clear </Button>
      </div>
    );
  }

}

export default Stats;