import React from 'react';
import Stats from '../Statistics/Statistics.js';
import Scrambler from '../Scrambler/Scrambler.js';
import './Timer.css';

// localStorage key
const STORAGE_KEY = 'simplict_session_v1';

class Timer extends React.Component {
  constructor() {
    super();
    this.state = {
      // Timer state
      time: 0,
      start: 0,
      isOn: false,
      isReady: false, // Ready state - spacebar held, timer armed

      // Solve records (new data model)
      solves: [],
      currentScramble: '',
      puzzleType: '3x3',

      // UI state
      refresh: false,
      width: window.innerWidth,
      manualInput: false,

      // Modal state
      showSolveDetail: false,
      selectedSolveId: null,
    };

    // Bind methods
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.handleSpace = this.handleSpace.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleWindowBlur = this.handleWindowBlur.bind(this);
    this.clearRecord = this.clearRecord.bind(this);
    this.refresh = this.refresh.bind(this);
    this.msToTime = this.msToTime.bind(this);
    this.handleHold = this.handleHold.bind(this);
    this.handleWindowSizeChange = this.handleWindowSizeChange.bind(this);
    this.toggleType = this.toggleType.bind(this);

    // New methods
    this.updateCurrentScramble = this.updateCurrentScramble.bind(this);
    this.deleteSolve = this.deleteSolve.bind(this);
    this.applyPenalty = this.applyPenalty.bind(this);
    this.openSolveDetail = this.openSolveDetail.bind(this);
    this.closeSolveDetail = this.closeSolveDetail.bind(this);
    this.updatePuzzleType = this.updatePuzzleType.bind(this);

    // Save timeout reference for cleanup
    this.saveTimeoutId = null;
    this._isMounted = false;

    // Captured time values for accurate timing
    this.stoppedTimeMs = 0;
    this.stoppedDisplayTime = '';
  }

  componentDidMount() {
    this._isMounted = true;
    window.addEventListener('resize', this.handleWindowSizeChange, true);
    // Note: "spacebar" is not a real event - timer uses div's onKeyUp instead
    window.addEventListener('spacebar', this.handleSpace, true);
    // Clear ready state if user tabs away while holding spacebar
    window.addEventListener('blur', this.handleWindowBlur, true);

    // Load session from localStorage
    this.loadSession();
  }

  componentWillUnmount() {
    this._isMounted = false;
    window.removeEventListener('resize', this.handleWindowSizeChange, true);
    window.removeEventListener('spacebar', this.handleSpace, true);
    window.removeEventListener('blur', this.handleWindowBlur, true);

    // Clear debounce timeout
    if (this.saveTimeoutId) {
      clearTimeout(this.saveTimeoutId);
    }

    // Final save before unmount
    this.saveSessionImmediate();
  }

  // Generate unique ID for solves
  generateSolveId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Sanitize scramble to prevent XSS (only allow cube notation chars)
  sanitizeScramble(str) {
    if (!str || typeof str !== 'string') return '';
    return str.replace(/[^A-Za-z0-9'\s+-]/g, '');
  }

  // Load session from localStorage
  loadSession() {
    try {
      const dataStr = localStorage.getItem(STORAGE_KEY);

      if (!dataStr) {
        // No saved data, start fresh
        return;
      }

      const data = JSON.parse(dataStr);

      // Validate data structure
      if (!data || typeof data !== 'object' || !Array.isArray(data.solves)) {
        console.warn('Invalid session data, starting fresh');
        localStorage.removeItem(STORAGE_KEY);
        return;
      }

      // Sanitize scrambles and restore Infinity for DNF
      const sanitizedSolves = data.solves.map(solve => ({
        ...solve,
        scramble: this.sanitizeScramble(solve.scramble),
        penalizedTimeMs:
          solve.penalizedTimeMs === null && solve.penalty === 'DNF'
            ? Infinity
            : solve.penalizedTimeMs,
      }));

      this.setState({
        solves: sanitizedSolves,
      });
    } catch (error) {
      console.error('Failed to load session:', error);
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  // Save session to localStorage (debounced)
  debouncedSave() {
    if (this.saveTimeoutId) {
      clearTimeout(this.saveTimeoutId);
    }

    this.saveTimeoutId = setTimeout(() => {
      this.saveSessionImmediate();
    }, 500);
  }

  // Save session immediately
  saveSessionImmediate() {
    if (!this._isMounted) return;

    try {
      const sessionData = {
        version: '1.0.0',
        solves: this.state.solves.map(solve => ({
          ...solve,
          // Convert Infinity to null for JSON serialization
          penalizedTimeMs: solve.penalizedTimeMs === Infinity ? null : solve.penalizedTimeMs,
        })),
        lastModified: Date.now(),
      };

      const dataStr = JSON.stringify(sessionData);

      // Check size before saving (warn at 4.5MB)
      if (dataStr.length > 4.5 * 1024 * 1024) {
        console.warn('Session data approaching localStorage limit');
      }

      localStorage.setItem(STORAGE_KEY, dataStr);
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded');
        // Could implement emergency save of last N solves here
      } else {
        console.error('Failed to save session:', error);
      }
    }
  }

  // Callback for Scrambler to update current scramble
  updateCurrentScramble(scramble) {
    this.setState({ currentScramble: this.sanitizeScramble(scramble) });
  }

  // Callback for Scrambler to update puzzle type
  updatePuzzleType(puzzleType) {
    this.setState({ puzzleType });
  }

  handleWindowSizeChange() {
    let windowWidth = window.innerWidth;
    this.setState({ width: windowWidth });
  }

  handleInputChange(e) {
    this.setState({ time: e.target.value });
  }

  handleInputSubmit(e) {
    e.preventDefault();
    // For manual input, create a solve record with the entered time
    const timeStr = this.state.time.toString().trim();
    if (timeStr) {
      const timeMs = parseFloat(timeStr) * 1000;
      if (!isNaN(timeMs) && timeMs > 0) {
        this.addSolve(timeMs, timeStr);
      }
    }
    this.setState({ refresh: true }, () => setTimeout(this.refresh, 500));
  }

  handleSpace(e) {
    if (this.state.manualInput) {
      return;
    }

    // Starts timer when spacebar is pressed
    if (e.keyCode === 32) {
      if (this.state.time === 0) {
        this.startTimer();
      } else {
        // Stops timer, wait 0.5s then export and reset
        this.stopTimer();
        this.setState({ refresh: true }, () => setTimeout(this.refresh, 500));
      }
    }
  }

  // Handle spacebar keydown - sets ready state for visual feedback
  handleKeyDown(e) {
    // Ignore if manual input mode is active
    if (this.state.manualInput) {
      return;
    }

    // Ignore if user is typing in an input field
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }

    // Only respond to spacebar (using modern e.key API)
    if (e.key !== ' ' && e.code !== 'Space') {
      return;
    }

    // Prevent default spacebar scroll behavior
    e.preventDefault();

    // If timer is idle, set ready state (visual feedback)
    if (this.state.time === 0 && !this.state.isOn && !this.state.isReady) {
      this.setState({ isReady: true });
    }
  }

  // Handle spacebar keyup - starts/stops timer
  handleKeyUp(e) {
    // Ignore if manual input mode is active
    if (this.state.manualInput) {
      return;
    }

    // Only respond to spacebar
    if (e.key !== ' ' && e.code !== 'Space') {
      return;
    }

    // Prevent default
    e.preventDefault();

    // CASE 1: Timer is ready (spacebar was held) - start timer
    if (this.state.isReady) {
      this.setState({ isReady: false }, () => {
        this.startTimer();
      });
    }
    // CASE 2: Timer is running - stop it
    else if (this.state.isOn) {
      this.stopTimer();
      this.setState({ refresh: true }, () => setTimeout(this.refresh, 500));
    }
  }

  // Handle window blur - clears ready state if user tabs away
  handleWindowBlur() {
    if (this.state.isReady) {
      this.setState({ isReady: false });
    }
  }

  handleHold(e) {
    if (this.state.time === 0) {
      // Fix: wrap in arrow function so it doesn't execute immediately
      setTimeout(() => this.startTimer(), 1000);
    } else {
      this.stopTimer();
      this.setState({ refresh: true });
      setTimeout(this.refresh, 500);
    }
  }

  // Formatting time to hh:mm:ss.cc format (cc is centiseconds)
  msToTime(s) {
    var pad = (n, z = 2) => ('00' + n).slice(-z);
    // Convert milliseconds to centiseconds (hundredths of a second)
    var centiseconds = Math.floor((s % 1000) / 10);
    if (s < 60000) {
      return pad(((s % 6e4) / 1000) | 0) + '.' + pad(centiseconds, 2);
    } else if (s >= 60000 && s < 3600000) {
      return (
        pad(((s % 3.6e6) / 6e4) | 0) +
        ':' +
        pad(((s % 6e4) / 1000) | 0) +
        '.' +
        pad(centiseconds, 2)
      );
    } else if (s >= 3600000) {
      return (
        pad((s / 3.6e6) | 0) +
        ':' +
        pad(((s % 3.6e6) / 6e4) | 0) +
        ':' +
        pad(((s % 6e4) / 1000) | 0) +
        '.' +
        pad(centiseconds, 2)
      );
    } else {
      alert("Wake up fool! You're taking too long to solve that cube!");
    }
  }

  // Function to start timer
  startTimer() {
    this.setState({
      time: this.state.time,
      start: Date.now() - this.state.time,
      isOn: true,
    });

    this.timer = setInterval(
      () =>
        this.setState({
          time: this.msToTime(Date.now() - this.state.start),
        }),
      1
    );
  }

  // Refresh and export time
  refresh() {
    this.setState({ refresh: false });
    this.exportTime();
    this.resetTimer();
  }

  // Stopping timer
  stopTimer() {
    // Capture the time at the moment of stopping (before any delay)
    this.stoppedTimeMs = Date.now() - this.state.start;
    this.stoppedDisplayTime = this.state.time;

    this.setState({
      isOn: false,
      refresh: true,
    });
    clearInterval(this.timer);
  }

  // Resetting timer to 0
  resetTimer() {
    this.setState({
      time: 0,
      refresh: false,
    });
  }

  // Create a new solve record and add to state
  addSolve(timeMs, displayTime) {
    const newSolve = {
      id: this.generateSolveId(),
      timeMs,
      displayTime,
      scramble: this.state.currentScramble,
      penalty: 'none',
      penalizedTimeMs: timeMs,
      timestamp: Date.now(),
      puzzleType: this.state.puzzleType,
    };

    this.setState(
      prev => ({ solves: [...prev.solves, newSolve] }),
      () => this.debouncedSave()
    );
  }

  // Export time - now creates a SolveRecord
  exportTime() {
    // Use the time captured when stopTimer() was called
    // This prevents timing drift from the 500ms delay before export
    const timeMs = this.stoppedTimeMs;
    const displayTime = this.stoppedDisplayTime;
    this.addSolve(timeMs, displayTime);
  }

  // Delete a solve by ID (immutable)
  deleteSolve(solveId) {
    this.setState(
      prev => ({
        solves: prev.solves.filter(solve => solve.id !== solveId),
        // Close modal if viewing deleted solve
        showSolveDetail: prev.selectedSolveId === solveId ? false : prev.showSolveDetail,
        selectedSolveId: prev.selectedSolveId === solveId ? null : prev.selectedSolveId,
      }),
      () => this.debouncedSave()
    );
  }

  // Apply penalty to a solve
  applyPenalty(solveId, penalty) {
    this.setState(
      prev => ({
        solves: prev.solves.map(solve => {
          if (solve.id !== solveId) return solve;

          let penalizedTimeMs;
          let displayTime;

          switch (penalty) {
            case 'DNF':
              penalizedTimeMs = Infinity;
              displayTime = 'DNF';
              break;
            case '+2':
              penalizedTimeMs = solve.timeMs + 2000;
              displayTime = this.msToTime(solve.timeMs + 2000) + '+';
              break;
            case 'none':
            default:
              penalizedTimeMs = solve.timeMs;
              displayTime = this.msToTime(solve.timeMs);
              break;
          }

          return {
            ...solve,
            penalty,
            penalizedTimeMs,
            displayTime,
          };
        }),
      }),
      () => this.debouncedSave()
    );
  }

  // Open solve detail modal
  openSolveDetail(solveId) {
    this.setState({
      showSolveDetail: true,
      selectedSolveId: solveId,
    });
  }

  // Close solve detail modal
  closeSolveDetail() {
    this.setState({
      showSolveDetail: false,
      selectedSolveId: null,
    });
  }

  // Clear all records
  clearRecord() {
    this.setState({ solves: [] }, () => this.debouncedSave());
  }

  toggleType() {
    this.setState({ manualInput: !this.state.manualInput });
  }

  // Get selected solve for modal
  getSelectedSolve() {
    if (!this.state.selectedSolveId) return null;
    return this.state.solves.find(s => s.id === this.state.selectedSolveId) || null;
  }

  // Get solve number (1-indexed position)
  getSolveNumber(solveId) {
    const index = this.state.solves.findIndex(s => s.id === solveId);
    return index >= 0 ? index + 1 : 0;
  }

  render() {
    const selectedSolve = this.getSelectedSolve();
    const selectedSolveNumber = selectedSolve ? this.getSolveNumber(selectedSolve.id) : 0;

    if (this.state.width <= 767) {
      return (
        <div
          onKeyDown={e => this.handleKeyDown(e)}
          onKeyUp={e => this.handleKeyUp(e)}
          tabIndex="0"
          id="timer-container"
        >
          {/* Passing refresh as prop to Scrambler for scramble sequence to refresh when timer stops */}
          <Scrambler
            refresh={this.state.refresh}
            toggleType={this.toggleType}
            width={this.state.width}
            onScrambleGenerated={this.updateCurrentScramble}
            onPuzzleTypeChange={this.updatePuzzleType}
          />

          {this.state.manualInput ? (
            <>
              <form onSubmit={e => this.handleInputSubmit(e)}>
                <input
                  id="manual-input"
                  type="text"
                  value={this.state.time}
                  onChange={e => this.handleInputChange(e)}
                />
              </form>
            </>
          ) : (
            <p
              id="timer-text"
              className={this.state.isReady ? 'ready' : ''}
              onPointerDown={this.handleHold}
              style={{ touchAction: 'none', userSelect: 'none' }}
            >
              {this.state.time}
            </p>
          )}

          {/* Passing solves & callbacks to statistics */}
          <Stats
            solves={this.state.solves}
            clearRecord={this.clearRecord}
            width={this.state.width}
            onDeleteSolve={this.deleteSolve}
            onApplyPenalty={this.applyPenalty}
            onOpenSolveDetail={this.openSolveDetail}
            showSolveDetail={this.state.showSolveDetail}
            selectedSolve={selectedSolve}
            selectedSolveNumber={selectedSolveNumber}
            onCloseSolveDetail={this.closeSolveDetail}
          />
        </div>
      );
    } else {
      return (
        <div
          onKeyDown={e => this.handleKeyDown(e)}
          onKeyUp={e => this.handleKeyUp(e)}
          tabIndex="0"
          id="timer-container"
        >
          {/* Passing refresh as prop to Scrambler for scramble sequence to refresh when timer stops */}
          <div className="w-full">
            <Scrambler
              refresh={this.state.refresh}
              toggleType={this.toggleType}
              width={this.state.width}
              onScrambleGenerated={this.updateCurrentScramble}
              onPuzzleTypeChange={this.updatePuzzleType}
            />
          </div>
          {this.state.manualInput ? (
            <>
              <form onSubmit={e => this.handleInputSubmit(e)}>
                <input
                  id="manual-input"
                  type="text"
                  value={this.state.time}
                  onChange={e => this.handleInputChange(e)}
                />
              </form>
            </>
          ) : (
            <p id="timer-text" className={this.state.isReady ? 'ready' : ''}>
              {' '}
              {this.state.time}{' '}
            </p>
          )}

          {/* Passing solves & callbacks to statistics */}
          <Stats
            solves={this.state.solves}
            clearRecord={this.clearRecord}
            width={this.state.width}
            onDeleteSolve={this.deleteSolve}
            onApplyPenalty={this.applyPenalty}
            onOpenSolveDetail={this.openSolveDetail}
            showSolveDetail={this.state.showSolveDetail}
            selectedSolve={selectedSolve}
            selectedSolveNumber={selectedSolveNumber}
            onCloseSolveDetail={this.closeSolveDetail}
          />
        </div>
      );
    }
  }
}

export default Timer;
