import React from 'react';
import logo from './logo.svg';
import '../App.css';
import { useState } from 'react';
import { ChakraProvider, Button, Input, Select } from '@chakra-ui/react';
import { Spinner, Text } from '@chakra-ui/react';

import { useForm } from 'react-hook-form';

export default function GenerateImage() {
  const [count, setCount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generateSuccess, setGenerateSuccess] = useState('');

  type Input = { count: number };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Input>();

  const generateSpecifyCount = async () => {
    try {
      setIsLoading(true);
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
          setIsLoading(false);
          setGenerateSuccess(data);
        });
    } catch (err) {
      console.log(err);
    }
  };
  const generateAll = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('http://localhost:8000/generate/all', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
      })
        .then(function (response) {
          return response.text();
        })
        .then(function (data) {
          setIsLoading(false);
          setGenerateSuccess(data);
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
  const all_generate_button = {
    transform: 'translate(-150px,-50px)',
  };
  const spinner = {
    display: 'block',
    transform: 'translateY(50px)',
  };

  return (
    <>
      <label>
        Count
        <Input
          style={input}
          type="text"
          className={'count'}
          {...register('count', {
            required: '生成数を入力してください',
            pattern: {
              value: /^([1-9]\d*|0)$/,
              message: '数値のみ入力してください。',
            },
          })}
          value={count}
          onChange={(event) => setCount(event.target.value)}
        />
      </label>
      <p style={{ color: 'red' }}>{errors.count?.message}</p>
      <Button
        style={button}
        onClick={handleSubmit(generateSpecifyCount)}
        colorScheme="teal"
        type="submit"
      >
        Generate By Specify Count
      </Button>
      <Button
        style={all_generate_button}
        colorScheme="twitter"
        onClick={generateAll}
      >
        Generate All Pattern
      </Button>
      {(() => {
        if (isLoading) {
          return (
            <Spinner
              style={spinner}
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          );
        } else if (generateSuccess) {
          return (
            <>
              <Text>{generateSuccess}!</Text>
            </>
          );
        }
      })()}
    </>
  );
}
