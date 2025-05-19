import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../polls.css';

const ResultsPage = () => {
  const { pollId } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/polls/${pollId}/results`)
      .then(res => {
        setResults(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching results:', err);
        setLoading(false);
      });
  }, [pollId]);

  if (loading) return <p>Loading results...</p>;

  return (
    <div className="poll-page">
      <header className="poll-header">
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <h1 className="poll-title">PollWise System</h1>
        </div>
      </header>

      <main className="poll-main">
        <div className="poll-container">
          <div className="poll-section-title">
            <h2 className="poll-heading">📊 Poll Results</h2>
            <p className="poll-description">See how the community voted.</p>
          </div>

          <div style={{
            background: '#fff',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            padding: '2rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            {results.map(opt => (
              <div
                key={opt.option_id}
                style={{
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  background: '#f9f9f9',
                  borderRadius: '8px'
                }}
              >
                <strong style={{ fontSize: '1.1rem', color: '#4f46e5' }}>{opt.option_text}</strong>
                <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>{opt.vote_count} vote(s)</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="poll-footer">
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        </div>
      </footer>
    </div>
  );
};

export default ResultsPage;
