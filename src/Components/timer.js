import React from 'react';
import ms from 'pretty-ms';
import { Row } from 'react-bootstrap';
import Stats from './statistics.js';
import Scrambler from './scrambler.js';
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
        };

        this.startTimer = this.startTimer.bind(this)
        this.stopTimer = this.stopTimer.bind(this)
        this.resetTimer = this.resetTimer.bind(this)
        this.handleSpace = this.handleSpace.bind(this)
        this.clearRecord = this.clearRecord.bind(this)
        this.refresh = this.refresh.bind(this)
    }

    componentDidMount() {
        document.addEventListener("resize", this.handleWindowSizeChange);
        document.addEventListener("spacebar", this.handleSpace, true);
    }

    componentWillUnmount() {
        document.removeEventListener("resize", this.handleWindowSizeChange);
        document.removeEventListener("spacebar", this.handleSpace, true);
    }

    handleSpace(e) {
        if (e.keyCode === 32) {
            if (this.state.time === 0) {
                this.startTimer();
            }
            else {
                this.stopTimer();
                this.setState({ refresh: true });
                setTimeout(this.refresh, 500);
            }
        }
    }

    startTimer() {
        this.setState({
            time: this.state.time,
            start: Date.now() - this.state.time,
            isOn: true
        })


        this.timer = setInterval(() => this.setState({
            time: ms(Date.now() - this.state.start)
        }), 1);

    }

    refresh() {
        this.setState({ refresh: false });
        this.exportTime();  
        this.resetTimer();
    }

    stopTimer() {
        this.setState({
            isOn: false,
            refresh: true,
        })
        clearInterval(this.timer)
    }

    resetTimer() {
        this.setState({
            time: 0,
            refresh: false
        })
    }

    exportTime() {
        this.setState({ record: this.state.record.concat(this.state.time.replace('m', '').replace('s', '  ')) });
    }

    clearRecord() {
        this.setState({ record: [] });
    }

    render() {
        return (
            <div onKeyUp={this.handleSpace} tabIndex="0" id="timer-container">
                <Row>
                    <Scrambler refresh={this.state.refresh} />
                </Row>
                <p id="timer-text"> {this.state.time} </p>
                <Stats record={this.state.record} clearRecord={this.clearRecord} />
            </div>
        );
    }

}

export default Timer;