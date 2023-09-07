import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { ChakraProvider, Button, Input, Select } from '@chakra-ui/react';

function App() {
  const [count, setCount] = useState('');
  const [image, setImage] = useState<File | null>(null);
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
  const getImage = async (e: HTMLInputElement) => {
    if (!e.files) return;
    const img = e.files[0];
    setImage(img);
    console.log(image);
  };
  const imgSubmit = async () => {
    try {
      const data = new FormData();
      //data.append('test', 'test');
      data.append('file', image!, '1589466137456_aFz3CE.png');

      console.log(image);
      console.log(data);
      console.log(data.get('file'));

      const res = await fetch('http://localhost:8000/setImg', {
        method: 'POST',
        body: data,
      }).then(function (response) {
        alert(response.text());
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ChakraProvider>
      <label
        style={{
          fontSize: '20px',
          display: 'block',
          transform: 'translate(200px,200px)',
        }}
      >
        生成画像数
      </label>
      <Input
        type="text"
        value={count}
        onChange={(event) => setCount(event.target.value)}
        style={{
          width: 120,
          height: 50,
          transform: 'translate(200px,200px)',
        }}
      />
      <Button
        onClick={handleSubmit}
        colorScheme="teal"
        type="submit"
        style={{
          width: 120,
          height: 55,
          transform: 'translate(200px,200px)',
        }}
      >
        Generate
      </Button>

      <form onSubmit={imgSubmit}>
        <input
          type="file"
          name="file"
          accept="image/*,.png,.jpg,.jpeg,.gif"
          onChange={(event) => getImage(event.target)}
        />
        <Button
          type="submit"
          colorScheme="teal"
          style={{
            transform: 'translateX(200px)',
          }}
        >
          submit
        </Button>
      </form>

      {/*
      <Select
        value={layer}
        onChange={(event) => setLayer(event.target.value)}
        placeholder="Select option"
      >
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
      </Select>
      */}
    </ChakraProvider>
  );
}

export default App;
