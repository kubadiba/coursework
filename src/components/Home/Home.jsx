import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <section>
      <h1>Algorithms and Data Structure</h1>
      <div className="sections">
        <div className="graph">
          <h2>Graph Algorithm SCC</h2>
          <Link to="/graph">
            <button className="start">Start</button>
          </Link>
        </div>
        <div className="dll">
          <h2>Doubly Linked List</h2>
          <Link to="/dll">
            <button className="start">Start</button>
          </Link>
        </div>
      </div>
      <footer>
        <p>Internet of Things 2024</p>
      </footer>
    </section>
  );
}

export default Home;
