import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { ChakraProvider, Button, Input, Select } from '@chakra-ui/react';
import axios from 'axios';

function App() {
  type FileType = 'File';
  const [count, setCount] = useState('');
  const [layer, setLayer] = useState('');
  const [image, setImage] = useState('');
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
  const getImage = async (e: any) => {
    const files = e.target.files;
    setImage(files[0]);
  };
  /*
  const getImage = async (e: any) => {
    var files = e.target.files;
    if (files.length > 0) {
    var file=files[0];
    var reader=new FileReader()
    reader.onload = (e) => {
      axios
      .post('http://localhost:8000/setImg', {
        headers: {
          'content-type': 'multipart/form-data',
        },
        body:reader.result,
      })
      if(e.target){
      setImage(e.target.result)
      }
  };
  reader.readAsDataURL(file)
}
  };
  const imgSubmit = async () => {
    const data = new FormData();
    data.append('image', image);

    console.log(data);
    axios
      .post('http://localhost:8000/setImg', {
        headers: {
          'content-type': 'multipart/form-data',
        },
        body:data,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };
*/
  const imgSubmit = async () => {
    console.log(image);
    axios.post('http://localhost:8000/setImg', {
      headers: {
        'Content-type': 'application/json',
      },
      body: { request_url: image },
    });
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
      {/*
      <form className="box" onSubmit={imgSubmit}>
      <Button
          colorScheme="teal"
          type="submit"
          style={{
            width: 120,
            height: 55,
            transform: 'translate(200px,200px)',
          }}
        >
          Saveimg
        </Button>
        */}
      <Input
        type="file"
        name="image"
        value={image}
        id="id"
        accept="image/*,.png,.jpg,.jpeg,.gif"
        onChange={(event) => setImage(event.target.value)}
      />
      <Button onClick={imgSubmit}>submit</Button>

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
      {/*
      <form
        action="http://localhost:8000/setImg"
        method="post"
        encType="multipart/form-data"
      >
        <Input type="file" name="image" />
      </form>
      */}
    </ChakraProvider>
  );
}

export default App;
