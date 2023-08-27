import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
async function generate(){
  const res= await fetch("localhost:8000/generate",{
    method: 'POST'
  })
  

}
  return (
    <div className="App">
     <button onClick={() => generate()}>generate</button>
    </div>
  );
}

export default App;
