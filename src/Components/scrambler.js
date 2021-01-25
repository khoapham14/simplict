import React from 'react';
import refresh from '../Assets/Refresh_icon.png';
import "./scrambler.css";

class Scrambler extends React.Component {
    constructor() {
        super();
        this.state = {
            scramble: '',
            time: '',
        };

        this.shuffle = this.shuffle.bind(this)
        this.scramble = this.scramble.bind(this)
        this.removeDuplicates = this.removeDuplicates.bind(this)
        this.getRandomInt = this.getRandomInt.bind(this)
        this.refreshScramble = this.refreshScramble.bind(this)
    }

    componentDidMount(){
        //Generates an initial scramble
        this.scramble();

        document.addEventListener("space", this.handleSpace, true); 
    }

    componentWillUnmount(){
        clearTimeout(this.refreshScramble);
        document.removeEventListener("space", this.handleSpace, true); 
    }

    handleSpace(e){

        this.props.handleSpace();
        if(e.keyCode === 32){
            this.refreshScramble();
        }
        
    }

    // Creates an array of sides and shuffles the element randomly
    shuffle() {
        var scr_array = ["R", "U", "D", "L", "F", "B"];
        var currentIndex = scr_array.length, temporaryValue, randomIndex;

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = scr_array[currentIndex];
            scr_array[currentIndex] = scr_array[randomIndex];
            scr_array[randomIndex] = temporaryValue;
        }

        return scr_array;
    }

    // Removes consecutive duplicates from an array to prevent redundant moves
    removeDuplicates(array, len = 0, canDelete = false) {
        if (len < array.length) {
            if (canDelete) {
                array.splice(len, 1);
                len--;
            }
            return this.removeDuplicates(array, len + 1, array[len] === array[len + 1])
        }

        return;
    }

    // Generates a random number from a range indicated by max.
    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    // Generate a scramble
    scramble() {

        var array_1 = this.shuffle();
        var array_2 = this.shuffle();
        var array_3 = this.shuffle();
        var array_4 = this.shuffle();

        var final_scr = array_1.concat(array_2, array_3, array_4);

        this.removeDuplicates(final_scr);

        var i;

        // Using RNG to randomly choose how to turn for each move.
        for (i = 0; i < final_scr.length; i++) {
            switch (final_scr[i]) {
                case "R":
                    switch (this.getRandomInt(3)) {
                        default:
                            break;
                        case 0:
                            final_scr[i] = "R"
                            break;
                        case 1:
                            final_scr[i] = "R'"
                            break;
                        case 2:
                            final_scr[i] = "R2"
                            break;
                    }
                    break;
                case "L":
                    switch (this.getRandomInt(3)) {
                        default:
                            break;
                        case 0:
                            final_scr[i] = "L"
                            break;
                        case 1:
                            final_scr[i] = "L'"
                            break;
                        case 2:
                            final_scr[i] = "L2"
                            break;
                    }
                    break;

                case "U":
                    switch (this.getRandomInt(3)) {
                        default:
                            break;
                        case 0:
                            final_scr[i] = "U"
                            break;
                        case 1:
                            final_scr[i] = "U'"
                            break;
                        case 2:
                            final_scr[i] = "U2"
                            break;
                    }
                    break;

                case "D":
                    switch (this.getRandomInt(3)) {
                        default:
                            break;
                        case 0:
                            final_scr[i] = "D"
                            break;
                        case 1:
                            final_scr[i] = "D'"
                            break;
                        case 2:
                            final_scr[i] = "D2"
                            break;
                    }
                    break;

                case "F":
                    switch (this.getRandomInt(3)) {
                        default:
                            break;
                        case 0:
                            final_scr[i] = "F"
                            break;
                        case 1:
                            final_scr[i] = "F'"
                            break;
                        case 2:
                            final_scr[i] = "F2"
                            break;
                    }
                    break;

                case "B":
                    switch (this.getRandomInt(3)) {
                        default:
                            break;
                        case 0:
                            final_scr[i] = "B"
                            break;
                        case 1:
                            final_scr[i] = "B'"
                            break;
                        case 2:
                            final_scr[i] = "B2"
                            break;
                    }
                    break;
                default:
                    break;
            }
        }

        final_scr = final_scr.join(" ");
        this.setState({ scramble: final_scr});
    }

    refreshScramble(){
        setTimeout(this.scramble, 500);
    }

    render() {
        return (  
            <div id="scramble"> 
                {this.state.scramble} 
                <img src={refresh} onClick={this.refreshScramble} id="refresh_icon" alt="refresh_button"/>
            </div>
        );
    }
}

export default Scrambler;