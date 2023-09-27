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
  const [image, setImage] = useState<FileList | null>(null);
  const [layerSuccess, setLayerSuccess] = useState('');

  type Input = { file: FileList; layer: string };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Input>();

  const getImage = async (e: HTMLInputElement) => {
    if (!e.files) return;
    const img = e.files;
    setImage(img);
  };
  const imgSubmit = async () => {
    try {
      const data = new FormData();
      data.append('layer', layer);
      for (let i = 0; i < image!.length; i++) {
        data.append('file', image![i]);
      }
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
    display: 'block',
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
            multiple
          />
          <Select
            style={select}
            value={layer}
            {...register('layer', {
              required: 'レイヤーを指定してください',
            })}
            onChange={(event) => setLayer(event.target.value)}
            placeholder="Select Layer"
          >
            <option value="01_background">background</option>
            <option value="02_template">template</option>
            <option value="03_chochin">chochin</option>
            <option value="04_outline">outline</option>
            <option value="05_kamon">kamon</option>
            <option value="06_central">central</option>
            <option value="07_type">type</option>
          </Select>
          <p style={{ color: 'red' }}>{errors.file?.message}</p>
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
