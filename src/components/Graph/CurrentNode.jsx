import React from 'react';

const CurrentNode = ({ node }) => (
  <div className="current-node">
    {node ? <p>Current top: V{node}</p> : <p>Algorithm not running</p>}
  </div>
);

export default CurrentNode;
