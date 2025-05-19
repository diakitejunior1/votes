import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ActivePolls from './pages/ActivePolls';
import CreatePoll from './pages/CreatePoll';
import VotePage from './pages/VotePage';
import ResultsPage from './pages/ResultsPage';
import './polls.css'; 

function App() {
  return (
    <Router>
      <div style={{ padding: '20px' }}>
        <nav style={{ 
  display: 'flex', 
  justifyContent: 'center', 
  gap: '30px', 
  marginBottom: '30px' 
}}>
  <Link to="/">🗳️ Active Polls</Link>
  <Link to="/create">➕ Create Poll</Link>
  <Link to="/poll/1">📝 Vote Page</Link>
  <Link to="/poll/1/results">📊 Poll Results</Link>
</nav>


        <Routes>
          <Route path="/" element={<ActivePolls />} />
          <Route path="/create" element={<CreatePoll />} />
          <Route path="/poll/:pollId" element={<VotePage />} />
          <Route path="/poll/:pollId/results" element={<ResultsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
