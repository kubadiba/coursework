import React from 'react';

function offsetLineCoords(fromNode, toNode, radius) {
  const dx = toNode.x - fromNode.x;
  const dy = toNode.y - fromNode.y;
  const length = Math.sqrt(dx * dx + dy * dy);
  if (length === 0) {
    return [fromNode.x, fromNode.y, toNode.x, toNode.y];
  }
  const ratioStart = radius / length;
  const ratioEnd = (length - radius) / length;
  const x1 = fromNode.x + dx * ratioStart;
  const y1 = fromNode.y + dy * ratioStart;
  const x2 = fromNode.x + dx * ratioEnd;
  const y2 = fromNode.y + dy * ratioEnd;
  return [x1, y1, x2, y2];
}

const Visualization = ({ nodes, edges }) => {
  return (
    <svg width="800" height="450">
      <defs>
        <marker
          id="arrow-marker"
          markerWidth="9"
          markerHeight="9"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L9,3 z" fill="black" />
        </marker>
      </defs>
      {edges.map((edge, i) => {
        const fromNode = nodes.find((n) => n.id === edge.from);
        const toNode = nodes.find((n) => n.id === edge.to);
        if (!fromNode || !toNode) return null;
        const [x1, y1, x2, y2] = offsetLineCoords(fromNode, toNode, 18);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="black"
            strokeWidth="2"
            markerEnd="url(#arrow-marker)"
          />
        );
      })}
      {nodes.map((n) => {
        let fillColor = 'gray';
        if (n.state === 'visited') fillColor = 'lightblue';
        if (n.state === 'final') fillColor = 'red';
        return (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r="18" fill={fillColor} />
            <text
              x={n.x}
              y={n.y + 5}
              textAnchor="middle"
              fill="#fff"
              fontSize="14"
            >
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default Visualization;
