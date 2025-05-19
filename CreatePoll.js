import React, { useState } from 'react';
import axios from 'axios';
import '../polls.css'; 

const CreatePoll = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [isPublic, setIsPublic] = useState(true);

  const handleOptionChange = (value, index) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        question,
        options: options.filter(opt => opt.trim() !== ''),
        isPublic
      };

      await axios.post('http://localhost:5000/api/polls', payload);
      alert('Poll created!');
      setQuestion('');
      setOptions(['', '']);
    } catch (error) {
      console.error('Error creating poll:', error);
    }
  };

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
      <h2 className="poll-heading">📋 Create a New Poll</h2>
      <p className="poll-description">Fill in your question and options below.</p>
    </div>

    <div className="poll-grid" style={{ justifyContent: 'center' }}>
      <div
        className="poll-button poll-button-purple"
        style={{
          maxWidth: '650px',
          width: '100%',
          padding: '2rem',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        <div className="poll-button-background"></div>
        <div
          className="poll-button-content"
          style={{
            width: '100%',
            padding: 0,
            boxSizing: 'border-box',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Question Input */}
          <input
            type="text"
            className="poll-input"
            placeholder="Poll question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          {/* Option Inputs */}
          {options.map((option, index) => (
            <input
              key={index}
              type="text"
              className="poll-input"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(e.target.value, index)}
            />
          ))}

          <button className="poll-cta-button" onClick={handleAddOption}>
            ➕ Add Option
          </button>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <label style={{ color: 'white', fontWeight: 'bold' }}>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={() => setIsPublic(!isPublic)}
                style={{ marginRight: '0.5rem' }}
              />
              Public Poll
            </label>
          </div>

          <button className="poll-cta-button" onClick={handleSubmit} style={{ marginTop: '1.5rem' }}>
            ✅ Submit Poll
          </button>
        </div>
      </div>
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

export default CreatePoll;