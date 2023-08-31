import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
function App() {
  const [count, setCount] = useState('');
  const handleSubmit = async () => {
    try {
      const res = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ count: count }),
      })
        .then(function (response) {
          return response.text();
        })
        .then(function (data) {
          alert(data); // this will be a string
        });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <label
        style={{
          fontSize: '20px',
          display: 'block',
          transform: 'translate(200px,200px)',
        }}
      >
        生成画像数
      </label>
      <input
        type="text"
        value={count}
        onChange={(event) => setCount(event.target.value)}
        style={{
          width: 120,
          height: 50,
          transform: 'translate(200px,200px)',
        }}
      />
      <button
        onClick={handleSubmit}
        type="submit"
        style={{ width: 120, height: 55, transform: 'translate(200px,200px)' }}
      >
        Generate
      </button>
    </>
  );
}

export default App;
