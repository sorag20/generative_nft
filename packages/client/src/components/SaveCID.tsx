import React from 'react';
import logo from './logo.svg';
import '../App.css';
import { useState } from 'react';
import { Button, Input } from '@chakra-ui/react';
import { selectAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

import { useForm } from 'react-hook-form';

export default function SaveCID() {
  const [cid, setCID] = useState('');
  type Input = { cid: string };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Input>();

  const saveCID = async () => {
    try {
      const res = await fetch('http://localhost:8000/saveCID', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ cid: cid }),
      })
        .then(function (response) {
          return response.text();
        })
        .then(function (data) {
          alert(data);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const input = {
    width: '300px',
    margin: '20px',
  };
  const button = {
    display: 'block',
    transform: 'translate(200px,10px)',
    margin: '20px 0',
  };
  const label = {
    display: 'block',
  };

  return (
    <>
      <label className={'label'} style={label}>
        Image CID
        <Input
          style={input}
          value={cid}
          {...register('cid', {
            required: 'CIDを指定してください',
          })}
          onChange={(event) => setCID(event.target.value)}
        />
      </label>
      <p style={{ color: 'red' }}>{errors.cid?.message}</p>

      <Button onClick={handleSubmit(saveCID)} colorScheme="teal" style={button}>
        SAVE
      </Button>
    </>
  );
}
