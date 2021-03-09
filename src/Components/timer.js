import React from 'react';
import { Row } from 'react-bootstrap';
import Stats from './statistics.js';
import Scrambler from './scrambler.js';
import ReactTouchEvents from 'react-touch-events';
import "./timer.css";

class Timer extends React.Component {
  constructor() {
    super();
    this.state = {
      time: 0,
      start: 0,
      isOn: false,
      result: 0,
      record: [],
      refresh: false,
      width: 0,
    };

    this.startTimer = this.startTimer.bind(this)
    this.stopTimer = this.stopTimer.bind(this)
    this.resetTimer = this.resetTimer.bind(this)
    this.handleSpace = this.handleSpace.bind(this)
    this.clearRecord = this.clearRecord.bind(this)
    this.refresh = this.refresh.bind(this)
    this.msToTime = this.msToTime.bind(this)
    this.handleHold = this.handleHold.bind(this)
    this.handleWindowSizeChange = this.handleWindowSizeChange.bind(this)

  }

  componentDidMount() {
    document.addEventListener("resize", this.handleWindowSizeChange,true);
    document.addEventListener("spacebar", this.handleSpace, true);
  }

  componentWillUnmount() {
    document.removeEventListener("resize", this.handleWindowSizeChange,true);
    document.removeEventListener("spacebar", this.handleSpace, true);
  }

  handleWindowSizeChange() {
    this.setState({ width: window.innerWidth });
  }

  handleSpace(e) {
    // Starts timer when spacebar is pressed.
    if (e.keyCode === 32) {
      if (this.state.time === 0) {
        this.startTimer()
        // console.log("starttimer called");  For debugging
      }
      else {
        // Stops timer, wait 0.5s then export and reset.
        this.stopTimer();
        this.setState({ refresh: true });
        setTimeout(this.refresh, 500);
      }
    }
  }

  handleHold(e) {
    if (this.state.time === 0) {
      setTimeout(this.startTimer(), 1000);
    }
    else {
      this.stopTimer();
      this.setState({ refresh: true });
      setTimeout(this.refresh, 500);
    }
  }



  // Formatting time to hh:mm:ss.ms format
  msToTime(s) {
    // Pad to 2 or 3 digits, default is 2
    var pad = (n, z = 2) => ('00' + n).slice(-z);
    if (s < 60000) {
      return pad((s % 6e4) / 1000 | 0) + '.' + pad(s % 1000, 2) + "  ";
    }
    else if (s >= 60000 && s < 3600000) {
      return pad((s % 3.6e6) / 6e4 | 0) + ':' + pad((s % 6e4) / 1000 | 0) + '.' + pad(s % 1000, 2) + "  ";
    }
    else if (s >= 3600000) {
      return pad(s / 3.6e6 | 0) + ':' + pad((s % 3.6e6) / 6e4 | 0) + ':' + pad((s % 6e4) / 1000 | 0) + '.' + pad(s % 1000, 2) + "  ";
    }
    else {
      alert("Wake up fool! You're taking too long to solve that cube!");
    }
  }

  // Function to start timer.
  startTimer() {
    // Starts timing by constantly checking for current time and saving to state.
    this.setState({
      time: this.state.time,
      start: Date.now() - this.state.time,
      isOn: true
    })


    this.timer = setInterval(() => this.setState({
      time: this.msToTime(Date.now() - this.state.start)
    }), 1);

  }

  // Function to check time passed since finger tap / space pressed.

  // Refresh and export time.
  refresh() {
    this.setState({ refresh: false });
    this.exportTime();
    this.resetTimer();
  }

  // Stopping timer.
  stopTimer() {
    this.setState({
      isOn: false,
      refresh: true,
    })
    clearInterval(this.timer)
  }

  // Resetting timer to 0.
  resetTimer() {
    this.setState({
      time: 0,
      refresh: false
    })
  }

  // Adding time to this.state.record for exporting to Statistics component
  exportTime() {
    this.setState({ record: this.state.record.concat(this.state.time) });
  }

  // Clearing all times
  clearRecord() {
    this.setState({ record: [] });
  }

  render() {
    const width = this.state.width;
    const isTouchDevice = width <= 768;

    if (isTouchDevice) {
      return (
        <div onKeyUp={this.handleSpace} tabIndex="0" id="timer-container">

          {/* Passing refresh as prop to Scrambler for scramble sequence to refresh when timer stops. */}
          <Row>
            <Scrambler refresh={this.state.refresh} />
          </Row>
          <ReactTouchEvents onTap={this.handleHold}>
            <p id="timer-text"> {this.state.time} </p>
          </ReactTouchEvents>

          {/* Passing record & clear record to statistics for processing */}
          <Stats record={this.state.record} clearRecord={this.clearRecord} />
        </div>
      );
    } else {
      return (
        <div onKeyUp={this.handleSpace} tabIndex="0" id="timer-container">
          {/* Passing refresh as prop to Scrambler for scramble sequence to refresh when timer stops. */}
          <Row>
            <Scrambler refresh={this.state.refresh} />
          </Row>
          <p id="timer-text"> {this.state.time} </p>

          {/* Passing record & clear record to statistics for processing */}
          <Stats record={this.state.record} clearRecord={this.clearRecord} />
        </div>


      );
    }

  }

}

export default Timer;