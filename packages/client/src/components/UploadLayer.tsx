import React from 'react';
import logo from './logo.svg';
import '../App.css';
import { useState } from 'react';
import { Button, Input, Select } from '@chakra-ui/react';
import { Spinner, Text, SimpleGrid } from '@chakra-ui/react';
import { selectAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

export default function UploadLayer() {
  const [layer, setLayer] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [layerSuccess, setLayerSuccess] = useState('');

  type Input = { file: File; layer: string };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Input>();

  const getImage = async (e: HTMLInputElement) => {
    if (!e.files) return;
    const img = e.files[0];
    setImage(img);
    console.log(image);
  };
  const imgSubmit = async () => {
    try {
      const data = new FormData();
      data.append('layer', layer);
      data.append('file', image!);
      setIsLoading(true);
      const res = await fetch('http://localhost:8000/setImg', {
        method: 'POST',
        body: data,
      })
        .then(function (response) {
          return response.text();
        })
        .then(function (data) {
          setIsLoading(false);
          setLayerSuccess(data);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const button = {
    display: 'block',
    transform: 'translate(200px,10px)',
    margin: '20px 0',
  };
  const select = {
    width: '300px',
  };
  const grid = {
    transform: 'translateY(15px)',
  };

  return (
    <>
      <form onSubmit={handleSubmit(imgSubmit)}>
        <SimpleGrid style={grid} minChildWidth="200px" spacing="40px">
          <Input
            type="file"
            accept="image/*,.png,.jpg,.jpeg,.gif"
            {...register('file', {
              required: 'ファイルを指定してください',
            })}
            onChange={(event) => getImage(event.target)}
          />
          <p style={{ color: 'red' }}>{errors.file?.message}</p>
          <Select
            style={select}
            value={layer}
            {...register('layer', {
              required: 'レイヤーを指定してください',
            })}
            onChange={(event) => setLayer(event.target.value)}
            placeholder="Select Layer"
          >
            <option value="background">background</option>
            <option value="beam">beam</option>
            <option value="body">body</option>
            <option value="cloth">cloth</option>
            <option value="crown">crown</option>
            <option value="foot">foot</option>
            <option value="mouth">mouth</option>
            <option value="skirt">skirt</option>
          </Select>
          <p style={{ color: 'red' }}>{errors.layer?.message}</p>
        </SimpleGrid>

        <Button style={button} type="submit" colorScheme="teal">
          submit
        </Button>
      </form>
      {(() => {
        if (isLoading) {
          return (
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          );
        } else if (layerSuccess) {
          return (
            <>
              <Text>{layerSuccess}!</Text>
            </>
          );
        }
      })()}
    </>
  );
}
