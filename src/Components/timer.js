import React from 'react';
import ms from 'pretty-ms';
import { Row, Container, Button } from 'react-bootstrap';
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
        };

        this.startTimer = this.startTimer.bind(this)
        this.stopTimer = this.stopTimer.bind(this)
        this.resetTimer = this.resetTimer.bind(this)
        this.handleSpace = this.handleSpace.bind(this)
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
            if (this.state.time === 0) {
                this.startTimer();
            }
            else {
                this.stopTimer();
                this.exportTime();
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
            time: ms(Date.now() - this.state.start)
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
        this.setState({ record: this.state.record.concat(this.state.time.replace('s', '  '))});
    }

    clearRecord(){
        this.setState({ record: []});
    }

    render() {
        return (
            <div onKeyUp={this.handleSpace} tabIndex="0" id="timer-container">
                <Container>
                    <Row>
                        <p id="timer-text"> {this.state.time} </p>
                    </Row>              
                </Container>
                <Button onClick={this.clearRecord}> Clear </Button>
                <p> {this.state.record} </p>
            </div>
        );
    }

}

export default Timer;