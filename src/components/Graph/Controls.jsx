import React from 'react';

const Controls = ({
  onAddNode,
  onDeleteNode,
  onAddEdge,
  onDeleteEdge,
  onStartSCC,
  onPauseSCC,
  onResetGraph,
  isRunning,
  isPaused,
  delay,
  setDelay,
}) => {
  return (
    <div className="controls">
      <button onClick={onAddNode}>Add Vertex</button>
      <button onClick={onDeleteNode}>Delete Vertex</button>
      <button onClick={onAddEdge}>Add Edge</button>
      <button onClick={onDeleteEdge}>Delete an edge</button>

      <button onClick={onStartSCC} disabled={isRunning}>
        Start (SCC)
      </button>
      <button onClick={onPauseSCC} disabled={!isRunning}>
        {isPaused ? 'Continue' : 'Pause'}
      </button>

      <button onClick={onResetGraph}>Reset</button>

      <div className="delay-control">
        <label htmlFor="delay-input">Delay : </label>
        <input
          id="delay-input"
          type="number"
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
          min="100"
          step="100"
        />
      </div>
    </div>
  );
};

export default Controls;
