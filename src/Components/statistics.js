import React from 'react';
import "./statistics.css";

class Stats extends React.Component {
    constructor() {
        super();
        this.state = {
            record: [],
            avg5: 0,
            avg12: 0,
            avg50: 0,
        };

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

    importTime(){

    }

    avg_of_5(){

    }

    avg_of_12(){
        
    }

    avg_of_50(){
        
    }

    render() {
        return (
            <div id="avg-container">
                <p id="avg-text"> ao5: {this.state.avg5} </p>   
                <p id="avg-text"> ao12: {this.state.avg12} </p>
                <p id="avg-text"> ao50: {this.state.avg50} </p>
            </div>
        );
    }

}

export default Stats;