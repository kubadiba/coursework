import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  createNode,
  insertNodeToEnd,
  findNode,
  deleteNodeFromList,
} from './LinkedListOperations';
import './DoublyLinkedList.css';

function DoublyLinkedList() {
  const [head, setHead] = useState(null);
  const [tail, setTail] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [highlightedNode, setHighlightedNode] = useState(null);

  const searchStepsRef = useRef([]);
  const animationRef = useRef(null);

  const CIRCLE_RADIUS = 30;
  const HORIZONTAL_GAP = 150;
  const SVG_HEIGHT = 300;
  const BASE_WIDTH = 200;

  const handleAdd = () => {
    const value = parseInt(inputValue, 10);
    if (isNaN(value)) {
      alert('Enter a number value');
      return;
    }
    const newNode = createNode(value);
    const { newHead, newTail } = insertNodeToEnd(head, tail, newNode);
    setHead(newHead);
    setTail(newTail);
    setInputValue('');
  };

  const stopAnimation = () => {
    if (animationRef.current) {
      clearInterval(animationRef.current);
      animationRef.current = null;
    }
  };

  const handleSearch = () => {
    const value = parseInt(inputValue, 10);
    if (isNaN(value)) {
      alert('Enter a numeric value');
      return;
    }
    stopAnimation();
    setHighlightedNode(null);

    const steps = findNode(head, value);
    if (steps.length === 0) {
      alert('The list is empty or does not contain the required value');
      return;
    }
    searchStepsRef.current = steps;
    setInputValue('');

    let index = 0;
    animationRef.current = setInterval(() => {
      if (index < steps.length) {
        setHighlightedNode(steps[index]);
        index++;
      } else {
        stopAnimation();
        const lastNode = steps[steps.length - 1];
        if (lastNode.value === value) {
          alert('A node with value ' + value);
        } else {
          alert('Not found.');
        }
      }
    }, 700);
  };

  const handleDelete = () => {
    const value = parseInt(inputValue, 10);
    if (isNaN(value)) {
      alert('Enter a number value');
      return;
    }
    stopAnimation();
    setHighlightedNode(null);

    const steps = findNode(head, value);
    if (steps.length === 0) {
      alert('The list is empty or does not contain the required value');
      return;
    }
    searchStepsRef.current = steps;
    setInputValue('');

    let index = 0;
    animationRef.current = setInterval(() => {
      if (index < steps.length) {
        setHighlightedNode(steps[index]);
        index++;
      } else {
        stopAnimation();
        const lastNode = steps[steps.length - 1];
        if (lastNode.value === value) {
          const { newHead, newTail } = deleteNodeFromList(head, tail, lastNode);
          setHead(newHead);
          setTail(newTail);
          setHighlightedNode(null);
          alert('Node ' + value + ' deleted');
        } else {
          alert('Not found to delete.');
        }
      }
    }, 700);
  };

  const renderList = () => {
    const nodes = [];
    let current = head;
    while (current) {
      nodes.push(current);
      current = current.next;
    }

    const svgWidth = Math.max(
      BASE_WIDTH,
      100 + nodes.length * HORIZONTAL_GAP
    );

    return (
      <svg
        width={svgWidth}
        height={SVG_HEIGHT}
        className="dll-canvas"
      >
        <defs>
          <marker
            id="arrowFwd"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L0,6 L9,3 z" fill="black" />
          </marker>
          <marker
            id="arrowBwd"
            markerWidth="10"
            markerHeight="10"
            refX="0"
            refY="3"
            orient="left"
          >
            <path d="M9,0 L9,6 L0,3 z" fill="red" />
          </marker>
        </defs>

        {nodes.map((node, i) => {
          const xCenter = 60 + i * HORIZONTAL_GAP;
          const yCenter = 150;
          let fillColor = '#ccc';
          if (node === highlightedNode) {
            fillColor = 'yellow';
          }

          let forwardLine = null;
          if (node.next) {
            forwardLine = (
              <line
                x1={xCenter + CIRCLE_RADIUS}
                y1={yCenter}
                x2={xCenter + HORIZONTAL_GAP - CIRCLE_RADIUS}
                y2={yCenter}
                stroke="black"
                strokeWidth="2"
                markerEnd="url(#arrowFwd)"
              />
            );
          }

          let backwardLine = null;
          if (node.prev) {
            backwardLine = (
              <line
                x1={xCenter - CIRCLE_RADIUS}
                y1={yCenter + 4}
                x2={xCenter - (HORIZONTAL_GAP - CIRCLE_RADIUS)}
                y2={yCenter + 4}
                stroke="red"
                strokeWidth="2"
                markerEnd="url(#arrowBwd)"
              />
            );
          }

          return (
            <g key={node.id}>
              {forwardLine}
              {backwardLine}
              <circle
                cx={xCenter}
                cy={yCenter}
                r={CIRCLE_RADIUS}
                fill={fillColor}
                stroke="#555"
              />
              <text
                x={xCenter}
                y={yCenter + 5}
                textAnchor="middle"
                fill="#000"
                fontSize="15"
                fontWeight="bold"
              >
                {node.value}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="dll-container">
      <h2 className="dll-title">A two-part list</h2>
      <div className="dll-ctrl-panel">
        <input
          type="text"
          className="dll-input"
          placeholder="Enter a number..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={handleAdd} className="dll-btn">
          Add
        </button>
        <button onClick={handleSearch} className="dll-btn">
          Find
        </button>
        <button onClick={handleDelete} className="dll-btn">
          Delete
        </button>
        <Link to="/">
          <button className="dll-btn dll-home">Home</button>
        </Link>
      </div>
      <div className="dll-visual-block">
        {renderList()}
      </div>
    </div>
  );
}

export default DoublyLinkedList;
