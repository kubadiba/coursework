import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Graph.css';
import Controls from './Controls';
import Visualization from './Visualization';
import CurrentNode from './CurrentNode';
import AdjacencyMatrix from './AdjacencyMatrix/AdjacencyMatrix';
import {
  initializeSCCProcess,
  startSCCProcess,
  pauseSCCProcess,
  resetSCCProcess,
  stepSCCProcess
} from './algorithms/scc';

const Graph = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentNode, setCurrentNode] = useState(null);
  const [delay, setDelay] = useState(800);
  const [sccData, setSccData] = useState(null);

  const isPausedRef = useRef(isPaused);
  const nodesRef = useRef(nodes);
  const intervalRef = useRef(null);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    if (sccData) {
      console.log('SCC Data updated:', sccData);
    }
  }, [sccData]);

  useEffect(() => {
    initializeGraph();
  }, []);

  const initializeGraph = () => {
    const initialNodes = [
      { id: 1, label: 'V1', x: 150, y: 100, state: 'unvisited' },
      { id: 2, label: 'V2', x: 250, y: 50,  state: 'unvisited' },
      { id: 3, label: 'V3', x: 350, y: 100, state: 'unvisited' },
      { id: 4, label: 'V4', x: 500, y: 150, state: 'unvisited' },
      { id: 5, label: 'V5', x: 300, y: 150, state: 'unvisited' },
      { id: 6, label: 'V6', x: 150, y: 250, state: 'unvisited' },
      { id: 7, label: 'V7', x: 250, y: 300, state: 'unvisited' },
      { id: 8, label: 'V8', x: 350, y: 250, state: 'unvisited' },
      { id: 9, label: 'V9', x: 450, y: 300, state: 'unvisited' },
    ];
    const initialEdges = [
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 1 },
      { from: 2, to: 5 },
      { from: 3, to: 4 },
      { from: 5, to: 3 },
      { from: 6, to: 1 },
      { from: 6, to: 7 },
      { from: 7, to: 8 },
      { from: 8, to: 6 },
      { from: 8, to: 9 },
      { from: 9, to: 4 },
    ];
    setNodes(initialNodes);
    setEdges(initialEdges);
  };

  const addNode = () => {
    if (nodes.length >= 15) {
      alert('Maximum number of nodes (15) reached');
      return;
    }
    const newNodeId = nodes.length + 1;
    const predefinedPositions = {
      10: { x: 50, y: 300 },
      11: { x: 100, y: 400 },
      12: { x: 200, y: 400 },
      13: { x: 300, y: 400 },
      14: { x: 400, y: 400 },
      15: { x: 500, y: 400 },
    };
    const pos = predefinedPositions[newNodeId] || { x: 80, y: 50 };
    const newNode = {
      id: newNodeId,
      label: `V${newNodeId}`,
      x: pos.x,
      y: pos.y,
      state: 'unvisited',
    };
    setNodes((prev) => [...prev, newNode]);
  };

  const deleteNode = () => {
    const nodeId = parseInt(prompt('Type ID of node to delete:'), 10);
    if (isNaN(nodeId) || !nodes.some((n) => n.id === nodeId)) {
      alert('Invalid node ID');
      return;
    }
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setEdges((prev) => prev.filter((e) => e.from !== nodeId && e.to !== nodeId));
  };

  const addEdge = () => {
    const fromId = parseInt(prompt('From node ID:'), 10);
    const toId = parseInt(prompt('To node ID:'), 10);
    if (
      isNaN(fromId) ||
      isNaN(toId) ||
      !nodes.some((n) => n.id === fromId) ||
      !nodes.some((n) => n.id === toId)
    ) {
      alert('Invalid IDs');
      return;
    }
    const outEdgesCount = edges.filter((e) => e.from === fromId).length;
    if (outEdgesCount >= 14) {
      alert('Maximum 14 edges from one node reached');
      return;
    }
    setEdges((prev) => [...prev, { from: fromId, to: toId }]);
  };

  const deleteEdge = () => {
    const fromId = parseInt(prompt('Delete edge from ID:'), 10);
    const toId = parseInt(prompt('Delete edge to ID:'), 10);
    if (
      isNaN(fromId) ||
      isNaN(toId) ||
      !edges.some((e) => e.from === fromId && e.to === toId)
    ) {
      alert('Edge not found');
      return;
    }
    setEdges((prev) => prev.filter((e) => !(e.from === fromId && e.to === toId)));
  };

  const updateNodeState = useCallback((id, newState) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, state: newState } : n))
    );
    setCurrentNode(id);
  }, []);

  const startSCC = () => {
    setNodes((prev) => prev.map((n) => ({ ...n, state: 'unvisited' })));
    const newData = initializeSCCProcess(nodes, edges);
    setSccData(newData);
    startSCCProcess(setIsRunning, setIsPaused);
  };

  const pauseSCC = () => {
    pauseSCCProcess(isRunning, setIsPaused, isPaused);
  };

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setSccData((prevData) => {
          if (!prevData) return prevData;
          const res = stepSCCProcess({
            sccData: prevData,
            updateNodeState,
            setIsRunning,
            isPausedRef
          });
          return res;
        });
      }, delay);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, isPaused, delay, updateNodeState]);

  const resetGraph = () => {
    resetSCCProcess(setNodes, setCurrentNode, setIsRunning, setIsPaused);
    setEdges([]);
    setSccData(null);
    initializeGraph();
  };

  return (
    <div className="custom-graph-page">
      <h1 className="custom-title">SCC (Kosaraju) Graph Visualization</h1>
      <div className="visual-block">
        <Visualization nodes={nodes} edges={edges} />
      </div>
      <div className="centered-controls">
        <Controls
          onAddNode={addNode}
          onDeleteNode={deleteNode}
          onAddEdge={addEdge}
          onDeleteEdge={deleteEdge}
          onStartSCC={startSCC}
          onPauseSCC={pauseSCC}
          onResetGraph={resetGraph}
          isRunning={isRunning}
          isPaused={isPaused}
          delay={delay}
          setDelay={setDelay}
        />
      </div>
      <div className="info-panel">
        <CurrentNode node={currentNode} />
      </div>
      <div className="matrix-panel">
        <AdjacencyMatrix nodes={nodes} edges={edges} />
      </div>
      <div className="home-button-panel">
        <Link to="/">
          <button className="go-home-btn">Home</button>
        </Link>
      </div>
    </div>
  );
};

export default Graph;
