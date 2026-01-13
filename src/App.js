import React from 'react';
import Timer from './Components/Timer/Timer.js';
import FloatingShapes from './Components/UI/FloatingShapes.js';
import './App.css';

function App() {
  return (
    <div id="simplict" className="relative min-h-screen overflow-hidden">
      {/* Maximalism animated background */}
      <FloatingShapes />

      {/* Main content */}
      <div className="relative z-10">
        <Timer />
      </div>
    </div>
  );
}

export default App;
