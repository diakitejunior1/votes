import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ResultsPage = () => {
  const { pollId } = useParams();
  const query = useQuery();

  const [results, setResults] = useState([]);
  const [poll, setPoll] = useState(null);
  const [password, setPassword] = useState(query.get('password') || '');
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (poll) {
      fetchResults();
    }
    // eslint-disable-next-line
  }, [poll]);

  const fetchResults = async () => {
    if (passwordRequired && password.trim() === '') {
      return; // Don't fetch without password
    }

    setLoading(true);
    setPasswordError('');

    try {
      const url = new URL(`http://localhost:5000/api/polls/${pollId}/results`);
      if (passwordRequired) {
        url.searchParams.append('password', password);
      }

      const res = await axios.get(url.toString());
      setResults(res.data);
    } catch (error) {
      if (error.response?.status === 403) {
        setPasswordError('Incorrect password.');
        setResults([]);
      } else {
        alert('Failed to fetch results');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!poll) return <div>Loading poll...</div>;

  if (passwordRequired && results.length === 0) {
    // Show password input
    return (
      <div>
        <h2>{poll.question}</h2>
        <p>This poll is password protected.</p>
        <input
          type="password"
          placeholder="Enter poll password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button onClick={fetchResults} disabled={loading}>
          {loading ? 'Checking...' : 'Submit'}
        </button>
        {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
      </div>
    );
  }

  return (
    <div>
      <h2>{poll.question} - Results</h2>
      {results.map(option => (
        <div key={option.option_id}>
          {option.option_text}: {option.vote_count} votes
        </div>
      ))}
    </div>
  );
};

export default ResultsPage;
