import React from 'react';
import './AdjacencyMatrix.css';

const AdjacencyMatrix = ({ nodes, edges }) => {
  const size = nodes.length;
  const matrix = Array(size)
    .fill(0)
    .map(() => Array(size).fill(0));

  edges.forEach((e) => {
    const fromIndex = nodes.findIndex((n) => n.id === e.from);
    const toIndex = nodes.findIndex((n) => n.id === e.to);
    if (fromIndex !== -1 && toIndex !== -1) {
      matrix[fromIndex][toIndex] = 1;
    }
  });

  return (
    <div className="scc-matrix">
      <h3>Adjacency matrix</h3>
      <table>
        <thead>
          <tr>
            <th></th>
            {nodes.map((n) => (
              <th key={n.id}>{n.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={nodes[i].id}>
              <td>{nodes[i].label}</td>
              {row.map((val, j) => (
                <td key={j} className={val === 0 ? 'zero-cell' : 'one-cell'}>
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdjacencyMatrix;
