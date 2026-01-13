import React from 'react';
import Button from '../UI/Button';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import SolveDetailModal from './SolveDetailModal';
import "./Statistics.css";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

class Stats extends React.Component {
  constructor() {
    super();
    this.state = {
      ao5: '--',
      ao12: '--',
      best: '--',
      worst: '--',
      session_average: '--',
      session_mean: '--',
      x_axis: [],
    };

    this.avg_of_5 = this.avg_of_5.bind(this);
    this.avg_of_12 = this.avg_of_12.bind(this);
    this.clearRecord = this.clearRecord.bind(this);
    this.getBest = this.getBest.bind(this);
    this.getWorst = this.getWorst.bind(this);
    this.getSessionAvg = this.getSessionAvg.bind(this);
    this.deleteLastSolve = this.deleteLastSolve.bind(this);
    this.generateX = this.generateX.bind(this);
    this.msToTime = this.msToTime.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleWindowSizeChange);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.solves.length !== this.props.solves.length ||
        prevProps.solves !== this.props.solves) {
      this.recalculateStats();
    }
  }

  componentWillUnmount() {
    // Cleanup will happen automatically for resize listener
  }

  // Recalculate all statistics
  recalculateStats() {
    this.setState({
      ao5: this.avg_of_5(),
      ao12: this.avg_of_12(),
      best: this.getBest(),
      worst: this.getWorst(),
      session_average: this.getSessionAvg(),
      session_mean: this.getSessionMean(),
      x_axis: this.generateX(),
    });
  }

  // Format milliseconds to time string
  msToTime(ms) {
    if (ms === Infinity || ms === null || ms === undefined) return 'DNF';

    const s = ms;
    const pad = (n, z = 2) => ('00' + n).slice(-z);

    if (s < 60000) {
      return pad((s % 6e4) / 1000 | 0) + '.' + pad(s % 1000, 2);
    } else if (s >= 60000 && s < 3600000) {
      return pad((s % 3.6e6) / 6e4 | 0) + ':' + pad((s % 6e4) / 1000 | 0) + '.' + pad(s % 1000, 2);
    } else {
      return pad(s / 3.6e6 | 0) + ':' + pad((s % 3.6e6) / 6e4 | 0) + ':' + pad((s % 6e4) / 1000 | 0) + '.' + pad(s % 1000, 2);
    }
  }

  // Filter valid solves (exclude DNF) and return penalized times
  filterValidSolves(solves) {
    return solves
      .filter(solve => solve.penalty !== 'DNF')
      .map(solve => solve.penalizedTimeMs);
  }

  generateX() {
    const labels = [];
    for (let i = 1; i <= this.props.solves.length; i++) {
      labels.push(i);
    }
    return labels;
  }

  getBest() {
    const validTimes = this.filterValidSolves(this.props.solves);
    if (validTimes.length === 0) return '--';

    const best = Math.min(...validTimes);
    return this.msToTime(best);
  }

  getWorst() {
    const validTimes = this.filterValidSolves(this.props.solves);
    if (validTimes.length === 0) return '--';

    const worst = Math.max(...validTimes);
    return this.msToTime(worst);
  }

  // Get best time in ms for comparison
  getBestMs() {
    const validTimes = this.filterValidSolves(this.props.solves);
    if (validTimes.length === 0) return null;
    return Math.min(...validTimes);
  }

  // Get worst time in ms for comparison
  getWorstMs() {
    const validTimes = this.filterValidSolves(this.props.solves);
    if (validTimes.length === 0) return null;
    return Math.max(...validTimes);
  }

  avg_of_5() {
    if (this.props.solves.length < 5) return '--';

    const last5 = this.props.solves.slice(-5);
    const validTimes = this.filterValidSolves(last5);

    // Need at least 3 valid times for Ao5 (can have up to 2 DNF)
    if (validTimes.length < 3) return 'DNF';

    // Sort and remove best/worst
    const sorted = [...validTimes].sort((a, b) => a - b);

    // If we have exactly 3 times, average all 3
    if (sorted.length === 3) {
      const avg = sorted.reduce((a, b) => a + b, 0) / 3;
      return this.msToTime(avg);
    }

    // Otherwise, trim best and worst
    sorted.shift(); // Remove best
    sorted.pop();   // Remove worst

    const avg = sorted.reduce((a, b) => a + b, 0) / sorted.length;
    return this.msToTime(avg);
  }

  avg_of_12() {
    if (this.props.solves.length < 12) return '--';

    const last12 = this.props.solves.slice(-12);
    const validTimes = this.filterValidSolves(last12);

    // Need at least 10 valid times for Ao12 (can have up to 2 DNF)
    if (validTimes.length < 10) return 'DNF';

    // Sort and remove best/worst
    const sorted = [...validTimes].sort((a, b) => a - b);
    sorted.shift(); // Remove best
    sorted.pop();   // Remove worst

    const avg = sorted.reduce((a, b) => a + b, 0) / sorted.length;
    return this.msToTime(avg);
  }

  getSessionAvg() {
    const validTimes = this.filterValidSolves(this.props.solves);

    if (validTimes.length < 3) return '--';

    // Sort and remove best/worst
    const sorted = [...validTimes].sort((a, b) => a - b);
    sorted.shift(); // Remove best
    sorted.pop();   // Remove worst

    const avg = sorted.reduce((a, b) => a + b, 0) / sorted.length;
    return this.msToTime(avg);
  }

  getSessionMean() {
    const validTimes = this.filterValidSolves(this.props.solves);

    if (validTimes.length === 0) return '--';

    const mean = validTimes.reduce((a, b) => a + b, 0) / validTimes.length;
    return this.msToTime(mean);
  }

  clearRecord() {
    this.props.clearRecord();
    this.setState({
      ao5: '--',
      ao12: '--',
      best: '--',
      worst: '--',
      session_average: '--',
      session_mean: '--',
    });
  }

  // Fixed: Use callback instead of direct mutation
  deleteLastSolve() {
    if (this.props.solves.length > 0) {
      const lastSolve = this.props.solves[this.props.solves.length - 1];
      this.props.onDeleteSolve(lastSolve.id);
    }
  }

  toggleDashboard() {
    const x = document.getElementById("dashboard");
    if (x.style.display === "none") {
      x.style.display = "flex";
    } else {
      x.style.display = "none";
    }
  }

  // Get display time for a solve (handles penalties)
  getDisplayTime(solve) {
    if (solve.penalty === 'DNF') return 'DNF';
    if (solve.penalty === '+2') return solve.displayTime;
    return solve.displayTime;
  }

  // Get chart data (use penalized times, null for DNF)
  getChartData() {
    return this.props.solves.map(solve => {
      if (solve.penalty === 'DNF') return null;
      return solve.penalizedTimeMs / 1000; // Convert to seconds for display
    });
  }

  render() {
    const bestMs = this.getBestMs();
    const worstMs = this.getWorstMs();

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: '#FFFFFF',
            font: {
              family: 'DM Sans, sans-serif',
              weight: 'bold'
            }
          }
        },
        title: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Time (seconds)',
            color: '#00F5D4',
            font: {
              family: 'DM Sans, sans-serif',
              weight: 'bold',
              size: 11
            }
          },
          ticks: {
            precision: 0,
            color: '#FFFFFF'
          },
          grid: {
            color: 'rgba(255, 58, 242, 0.2)'
          }
        },
        x: {
          display: true,
          title: {
            display: true,
            text: 'Solve #',
            color: '#FF3AF2',
            font: {
              family: 'DM Sans, sans-serif',
              weight: 'bold',
              size: 11
            }
          },
          ticks: {
            color: '#FFFFFF'
          },
          grid: {
            color: 'rgba(0, 245, 212, 0.2)'
          }
        }
      }
    };

    const chartData = {
      labels: this.state.x_axis,
      datasets: [
        {
          label: 'Solve Times',
          fill: true,
          lineTension: 0.4,
          backgroundColor: 'rgba(255, 58, 242, 0.1)',
          borderColor: '#FF3AF2',
          borderWidth: 3,
          pointBackgroundColor: '#00F5D4',
          pointBorderColor: '#FFE600',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 10,
          pointHoverBackgroundColor: '#FFE600',
          pointHoverBorderColor: '#FF3AF2',
          data: this.getChartData(),
          spanGaps: true // Skip null values (DNF)
        }
      ]
    };

    return (
      <div id="stats">
        <div id="avg-container">
          <p id="avg-text"> Average of 5: {this.state.ao5} </p>
          <p id="avg-text"> Average of 12: {this.state.ao12}</p>
        </div>
        <Button variant="outline-dark" id="toggle-button" onClick={this.toggleDashboard}>Dashboard</Button>
        <div id="dashboard" className="flex flex-col lg:flex-row gap-4 p-4">
          {/* Session Summary Section */}
          <div id="stats_section" className="lg:w-1/5 w-full">
            <p id="dashboard_header">Session Summary</p>
            <div id="main_stats">
              <div> <strong>Session Best:</strong> {this.state.best} </div>
              <div> <strong>Session Worst:</strong> {this.state.worst} </div>
              <div> <strong>Session Average:</strong> {this.state.session_average}</div>
              <div> <strong>Session Mean:</strong> {this.state.session_mean} </div>
            </div>
          </div>

          {/* Session Data Section */}
          <div id="data_section" className="lg:w-2/5 w-full">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="lg:w-1/3">
                <p id="dashboard_header">Session Data</p>
                <p id="main_stats">All individual times recorded for this session.</p>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline-dark" id="reset-button" onClick={this.deleteLastSolve}> Delete Last </Button>
                  <Button variant="outline-dark" id="reset-button" onClick={this.clearRecord}>Reset</Button>
                </div>
              </div>
              <div className="lg:w-2/3" id="recorded_times" role="list" aria-label="Recorded solve times">
                {this.props.solves.length === 0 ? (
                  <p className="empty-state">No solves recorded yet</p>
                ) : (
                  this.props.solves.slice().reverse().map((solve, index, arr) => {
                    const solveNumber = arr.length - index;
                    const isBest = bestMs !== null && solve.penalizedTimeMs === bestMs && solve.penalty !== 'DNF' && this.props.solves.length > 1;
                    const isWorst = worstMs !== null && solve.penalizedTimeMs === worstMs && solve.penalty !== 'DNF' && this.props.solves.length > 1;

                    // Build class names
                    let className = 'time-pill';
                    if (isBest) className += ' best-time';
                    if (isWorst) className += ' worst-time';
                    if (solve.penalty === '+2') className += ' penalty-plus2';
                    if (solve.penalty === 'DNF') className += ' penalty-dnf';

                    // Aria label
                    let ariaLabel = `Solve ${solveNumber}: ${this.getDisplayTime(solve)}`;
                    if (isBest) ariaLabel = `Best time: ${this.getDisplayTime(solve)}`;
                    if (isWorst) ariaLabel = `Worst time: ${this.getDisplayTime(solve)}`;
                    if (solve.penalty === '+2') ariaLabel += ' (plus 2 penalty)';
                    if (solve.penalty === 'DNF') ariaLabel += ' (did not finish)';

                    return (
                      <span
                        key={solve.id}
                        className={className}
                        role="listitem"
                        aria-label={ariaLabel}
                        onClick={() => this.props.onOpenSolveDetail(solve.id)}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            this.props.onOpenSolveDetail(solve.id);
                          }
                        }}
                      >
                        {this.getDisplayTime(solve)}
                      </span>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Session Chart Section */}
          <div id="chart_section" className="lg:w-2/5 w-full">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="lg:w-1/3">
                <p id="dashboard_header">Performance Graph</p>
                <p id="main_stats">Track your solve times over the session. X-axis shows solve number, Y-axis shows time in seconds.</p>
              </div>
              <div className="lg:w-2/3">
                <Line data={chartData}
                  width={5}
                  height={2}
                  options={chartOptions}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Solve Detail Modal */}
        <SolveDetailModal
          isOpen={this.props.showSolveDetail}
          onClose={this.props.onCloseSolveDetail}
          solve={this.props.selectedSolve}
          solveNumber={this.props.selectedSolveNumber}
          onApplyPenalty={(penalty) => {
            if (this.props.selectedSolve) {
              this.props.onApplyPenalty(this.props.selectedSolve.id, penalty);
            }
          }}
          onDelete={() => {
            if (this.props.selectedSolve) {
              this.props.onDeleteSolve(this.props.selectedSolve.id);
            }
          }}
        />
      </div>
    );
  }
}

export default Stats;
