import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const VotePage = () => {
  const { pollId } = useParams();
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/polls/${pollId}`)
      .then(res => {
        setPoll(res.data);
        setPasswordRequired(!res.data.is_public);
      })
      .catch(err => {
        console.error(err);
      });
  }, [pollId]);

  const handleVote = async () => {
    if (!selectedOption) {
      alert('Please select an option.');
      return;
    }

    if (passwordRequired && password.trim() === '') {
      alert('Password is required for this poll.');
      return;
    }

    setLoading(true);
    setPasswordError('');
    try {
      await axios.post(`http://localhost:5000/api/polls/${pollId}/vote`, {
        optionId: selectedOption,
        password: passwordRequired ? password : null,
      });
      setVoted(true);
    } catch (error) {
      if (error.response?.status === 403) {
        setPasswordError('Incorrect password.');
      } else {
        alert('Error submitting vote.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!poll) return <div>Loading poll...</div>;

  if (voted) {
    return (
      <div>
        <h3>Thanks for voting!</h3>
        <Link to={`/poll/${pollId}/results${passwordRequired ? `?password=${encodeURIComponent(password)}` : ''}`}>
          View Results
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2>{poll.question}</h2>
      {poll.options.map(option => (
        <div key={option.id}>
          <label>
            <input
              type="radio"
              name="option"
              value={option.id}
              onChange={() => setSelectedOption(option.id)}
            />
            {option.option_text}
          </label>
        </div>
      ))}
      {passwordRequired && (
        <div>
          <input
            type="password"
            placeholder="Enter poll password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
        </div>
      )}
      <button onClick={handleVote} disabled={loading}>
        {loading ? 'Submitting...' : 'Vote'}
      </button>
    </div>
  );
};

export default VotePage;
