import React from 'react';
import Timer from './Components/timer.js';
import { Row } from "react-bootstrap";
import './App.css';

class App extends React.Component {
  _isMounted = false;

  constructor() {
    super();
    this.state = {
      width: window.innerWidth,
    };

    this.handleSizeChange = this.handleSizeChange.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    window.addEventListener("resize", this.handleSizeChange, true)
  }

  componentWillUnmount() {
    this._isMounted = false;
    window.removeEventListener("resize", this.handleSizeChange, true)
  }

  handleSizeChange() {
    this.setState({ width: window.innerWidth })
  }

  render() {
    const width = this.state.width;
    const isDesktop = width > 700;
    const isTablet = width <= 700 && width > 480;
    const isMobile = width <= 480;

    return (
      <div>
        <div id="simplict">
          <Row>
            <Timer />
          </Row>
        </div>
      </div>
    );
  }

}

export default App;
