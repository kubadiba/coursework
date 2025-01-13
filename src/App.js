import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Graph from './components/Graph/Graph';
import DoublyLinkedList from './components/DoublyLinkedList/DoublyLinkedList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/graph" element={<Graph />} />
        <Route path="/dll" element={<DoublyLinkedList />} />
      </Routes>
    </Router>
  );
}

export default App;
