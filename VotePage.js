import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../polls.css'; // already styled

const VotePage = () => {
  const { pollId } = useParams();
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/polls/${pollId}`)
      .then(res => setPoll(res.data))
      .catch(err => console.error('Error fetching poll:', err));
  }, [pollId]);

  const handleVote = () => {
    if (!selectedOption) {
      return alert("Select an option first.");
    }

    setLoading(true);

    axios.post(`http://localhost:5000/api/polls/${pollId}/vote`, { optionId: selectedOption })
      .then(() => {
        setVoted(true);
        setLoading(false);
        alert('Vote recorded!');
      })
      .catch(err => {
        console.error('Voting failed:', err);
        alert('Voting failed. Please try again.');
        setLoading(false);
      });
  };

  if (!poll) return <p>Loading poll...</p>;

  return (
    <div className="poll-page">
      <main className="poll-main">
        <div className="poll-container">
          <div className="poll-section-title">
            <h2 className="poll-heading">🗳️ {poll.question}</h2>
            <p className="poll-description">Select an option below and cast your vote.</p>
          </div>

          <div className="poll-grid" style={{ justifyContent: 'center' }}>
            <div
              className="poll-button poll-button-blue"
              style={{
                maxWidth: '650px',
                width: '100%',
                padding: '2rem',
                boxSizing: 'border-box'
              }}
            >
              <div className="poll-button-background"></div>
              <div className="poll-button-content" style={{ width: '100%' }}>
                {poll.options && poll.options.length > 0 ? (
                  poll.options.map(opt => (
                    <div key={opt.id} style={{ marginBottom: '1rem' }}>
                      <label style={{ color: 'white', fontWeight: 'bold' }}>
                        <input
                          type="radio"
                          name="option"
                          value={opt.id}
                          onChange={() => setSelectedOption(opt.id)}
                          style={{ marginRight: '0.5rem' }}
                        />
                        {opt.option_text}
                      </label>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'white' }}>No options available for this poll.</p>
                )}

                <button
                  className="poll-cta-button"
                  onClick={handleVote}
                  disabled={loading}
                  style={{ marginTop: '1rem' }}
                >
                  {loading ? 'Submitting...' : 'Submit Vote'}
                </button>

                {voted && (
                  <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <Link to={`/poll/${pollId}/results`} style={{ color: 'white', fontWeight: 'bold' }}>
                      📊 View Results
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VotePage;
