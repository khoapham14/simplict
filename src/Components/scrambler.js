import React from 'react';
import refresh from '../Assets/Refresh_icon.png';
import "./scrambler.css";

class Scrambler extends React.Component {
  constructor() {
    super();
    this.state = {
      scramble: '',
      time: '',
      solve_started: false,
      puzzle_type: '3x3',
    };

    this.shuffle = this.shuffle.bind(this)
    this.scramble = this.scramble.bind(this)
    this.removeDuplicates = this.removeDuplicates.bind(this)
    this.getRandomInt = this.getRandomInt.bind(this)
    this.refreshScramble = this.refreshScramble.bind(this)
    this.refreshOnSolve = this.refreshOnSolve.bind(this)
    this.remove4x4Error = this.remove4x4Error.bind(this)
  }

  componentDidMount() {
    //Generates an initial scramble
    this.scramble();
    document.addEventListener("refresh_scr", this.refreshOnSolve, true)

  }

  componentWillUnmount() {
    clearTimeout(this.refreshScramble);
    document.removeEventListener("refresh_scr", this.refreshOnSolve, true)
  }

  refreshOnSolve() {
    if (this.props.refresh === true) {
      this.refreshScramble();
      console.log("Refresh");
    }
    else {

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

  // Removes 4x4 opposing layers turn from an array to prevent redundant moves
  removeDuplicates(array, len = 0, canDelete = false) {
    if (len < array.length) {
      if (canDelete) {   // If element is the same as the next one, deletes 1 and go back 1 step. 
        array.splice(len, 1);
        len = len - 2;
      }

      var consecutive = (array[len] === array[len + 1])
      var one_apart;

      switch (array[len]) {
        case "F":
          if (array[len + 1] === "B" && array[len] === array[len + 2]) {
            one_apart = true;
          }
          break;
        case "B":
          if (array[len + 1] === "F" && array[len] === array[len + 2]) {
            one_apart = true;
          }
          break;

        case "L":
          if (array[len + 1] === "R" && array[len] === array[len + 2]) {
            one_apart = true;
          }
          break;
        case "R":
          if (array[len + 1] === "L" && array[len] === array[len + 2]) {
            one_apart = true;
          }
          break;
        case "U":
          if (array[len + 1] === "D" && array[len] === array[len + 2]) {
            one_apart = true;
          }
          break;

        case "D":
          if (array[len + 1] === "U" && array[len] === array[len + 2]) {
            one_apart = true;
          }
          break;
        default:
          one_apart = false;
          break;
      }

      var isDeletable;

      if (consecutive || one_apart) {
        isDeletable = true;
      } else {
        isDeletable = false;
      }

      return this.removeDuplicates(array, len + 1, isDeletable)
    }

  }


  remove4x4Error(array, len = 0, canDelete = false) {
    if (len < array.length) {
      if (canDelete) {
        array.splice(len, 1);
        len--;
      }

      var isDeletable;

      switch (array[len]) {
        case "F":
          if (array[len + 1] === "B" || array[len - 1] === "B") {
            isDeletable = true;
          }
          break;
        case "B":
          if (array[len + 1] === "F" || array[len - 1] === "F") {
            isDeletable = true;
          }
          break;
        case "R":
          if (array[len + 1] === "L" || array[len - 1] === "L") {
            isDeletable = true;
          }
          break;
        case "L":
          if (array[len + 1] === "R" || array[len - 1] === "R") {
            isDeletable = true;
          }
          break;
        case "U":
          if (array[len + 1] === "D" || array[len - 1] === "D") {
            isDeletable = true;
          }
          break;
        case "D":
          if (array[len + 1] === "U" || array[len - 1] === "U") {
            isDeletable = true;
          }
          break;

        default:
          isDeletable = false;
          break;
      }

      return this.remove4x4Error(array, len + 1, isDeletable)
    }

  }


  // Generates a random number from a range indicated by max.
  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  // Generate a scramble
  scramble() {

    switch (this.state.puzzle_type) {
      case "3x3":
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
        this.setState({ scramble: final_scr });
        break;

      case "4x4":
        array_1 = this.shuffle();
        array_2 = this.shuffle();
        array_3 = this.shuffle();
        array_4 = this.shuffle();
        var array_5 = this.shuffle();
        var array_6 = this.shuffle();
        var array_7 = this.shuffle();
        var array_8 = this.shuffle();

        final_scr = array_1.concat(array_2, array_3, array_4, array_5, array_6, array_7, array_8);

       
        this.removeDuplicates(final_scr);
        this.remove4x4Error(final_scr);


        //Using RNG to randomly choose how to turn for each move.
        for (i = 0; i < final_scr.length; i++) {
          switch (final_scr[i]) {
            case "R":
              switch (this.getRandomInt(6)) {
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
                case 3:
                  final_scr[i] = "Rw"
                  break;
                case 4:
                  final_scr[i] = "Rw'"
                  break;
                case 5:
                  final_scr[i] = "Rw2"
                  break;
              }
              break;
            case "L":
              switch (this.getRandomInt(6)) {
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
                case 3:
                  final_scr[i] = "Lw"
                  break;
                case 4:
                  final_scr[i] = "Lw'"
                  break;
                case 5:
                  final_scr[i] = "Lw2"
                  break;
              }
              break;

            case "U":
              switch (this.getRandomInt(6)) {
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
                case 3:
                  final_scr[i] = "Uw"
                  break;
                case 4:
                  final_scr[i] = "Uw'"
                  break;
                case 5:
                  final_scr[i] = "Uw2"
                  break;
              }
              break;

            case "D":
              switch (this.getRandomInt(6)) {
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
                case 3:
                  final_scr[i] = "Dw"
                  break;
                case 4:
                  final_scr[i] = "Dw'"
                  break;
                case 5:
                  final_scr[i] = "Dw2"
                  break;
              }
              break;

            case "F":
              switch (this.getRandomInt(6)) {
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
                case 3:
                  final_scr[i] = "Fw"
                  break;
                case 4:
                  final_scr[i] = "Fw'"
                  break;
                case 5:
                  final_scr[i] = "Fw2"
                  break;
              }
              break;

            case "B":
              switch (this.getRandomInt(6)) {
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
                case 3:
                  final_scr[i] = "Bw"
                  break;
                case 4:
                  final_scr[i] = "Bw'"
                  break;
                case 5:
                  final_scr[i] = "Bw2"
                  break;
              }

              break;
            default:
              break;
          }
        }

        final_scr = final_scr.join(" ");
        this.setState({ scramble: final_scr });
        break;
      case "5x5":
        array_1 = this.shuffle();
        array_2 = this.shuffle();
        array_3 = this.shuffle();
        array_4 = this.shuffle();
        array_5 = this.shuffle();
        array_6 = this.shuffle();
        array_7 = this.shuffle();
        array_8 = this.shuffle();
        var array_9 = this.shuffle();
        var array_10 = this.shuffle();

        final_scr = array_1.concat(array_2, array_3, array_4, array_5, array_6, array_7, array_8, array_9, array_10);

       
        this.removeDuplicates(final_scr);



        //Using RNG to randomly choose how to turn for each move.
        for (i = 0; i < final_scr.length; i++) {
          switch (final_scr[i]) {
            case "R":
              switch (this.getRandomInt(6)) {
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
                case 3:
                  final_scr[i] = "Rw"
                  break;
                case 4:
                  final_scr[i] = "Rw'"
                  break;
                case 5:
                  final_scr[i] = "Rw2"
                  break;
              }
              break;
            case "L":
              switch (this.getRandomInt(6)) {
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
                case 3:
                  final_scr[i] = "Lw"
                  break;
                case 4:
                  final_scr[i] = "Lw'"
                  break;
                case 5:
                  final_scr[i] = "Lw2"
                  break;
              }
              break;

            case "U":
              switch (this.getRandomInt(6)) {
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
                case 3:
                  final_scr[i] = "Uw"
                  break;
                case 4:
                  final_scr[i] = "Uw'"
                  break;
                case 5:
                  final_scr[i] = "Uw2"
                  break;
              }
              break;

            case "D":
              switch (this.getRandomInt(6)) {
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
                case 3:
                  final_scr[i] = "Dw"
                  break;
                case 4:
                  final_scr[i] = "Dw'"
                  break;
                case 5:
                  final_scr[i] = "Dw2"
                  break;
              }
              break;

            case "F":
              switch (this.getRandomInt(6)) {
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
                case 3:
                  final_scr[i] = "Fw"
                  break;
                case 4:
                  final_scr[i] = "Fw'"
                  break;
                case 5:
                  final_scr[i] = "Fw2"
                  break;
              }
              break;

            case "B":
              switch (this.getRandomInt(6)) {
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
                case 3:
                  final_scr[i] = "Bw"
                  break;
                case 4:
                  final_scr[i] = "Bw'"
                  break;
                case 5:
                  final_scr[i] = "Bw2"
                  break;
              }

              break;
            default:
              break;
          }
        }

        final_scr = final_scr.join(" ");
        this.setState({ scramble: final_scr });
        break;
      case "Megaminx":
        break;
      default:
        return this.state.scramble;
    }
  }

  refreshScramble() {
    setTimeout(this.scramble, 500);
  }

  render() {
    return (
      <div id="scramble">
        {this.state.scramble}
        {this.refreshOnSolve()}
        <img src={refresh} onClick={this.refreshScramble} id="refresh_icon" alt="refresh_button" />
      </div>
    );
  }
}

export default Scrambler;