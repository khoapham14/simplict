import React from 'react';
import ms from 'pretty-ms';
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
                        <p id="timer-text"> {this.state.time} </p>
                    </Row>  
                    <Row>
                    <p id="avg-text"> ao5:  </p>    
                    </Row>      
                    <Row>
                    <p id="avg-text"> ao12: </p>
                    </Row>               
                </Container>
                <p> Stats </p>
            </div>
        );
    }

}

export default Timer;