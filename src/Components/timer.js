import React from 'react';
import ms from 'pretty-ms';
import Scrambler from './scrambler.js';
import { Row, Col, Container } from 'react-bootstrap';
import "./timer.css";

class Timer extends React.Component {
    constructor() {
        super();
        this.state = {
            time: 0,
            start: 0,
            isOn: false,
            result: 0,
        };

        this.startTimer = this.startTimer.bind(this)
        this.stopTimer = this.stopTimer.bind(this)
        this.resetTimer = this.resetTimer.bind(this)
        this.handleSpace = this.handleSpace.bind(this)
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
            if (this.state.time === 0) {
                this.startTimer();
            }
            else {
                this.stopTimer();
                this.resetTimer();
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
            time: ms(Date.now() - this.state.start, { colonNotaiton: true })
        }), 1);

    }

    stopTimer() {
        this.setState({
            isOn: false,
            result: this.state.time
        })
        clearInterval(this.timer)
    }

    resetTimer() {
        this.setState({ time: 0 })
    }

    exportTime() {

    }

    render() {
        return (
            <div onKeyUp={this.handleSpace} tabIndex="0" id="timer-container">
                <Container>
                    <Row>
                        <Scrambler />
                    </Row>
                    <Row>
                        <p id="timer-text"> {this.state.time} </p>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <p>Statistics</p>
                        </Col>
                        <Col md={3}>
                            <p>Statistics</p>
                        </Col>
                        <Col md={3}>
                            <p>Statistics</p>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }

}

export default Timer;