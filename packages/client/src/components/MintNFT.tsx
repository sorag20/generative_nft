import React from 'react';
import logo from './logo.svg';
import '../App.css';
import { useState } from 'react';
import { Button, Input } from '@chakra-ui/react';
import { Spinner, Text, Link } from '@chakra-ui/react';

import { ethers } from 'ethers';
import GenerativeNFT from '../utils/GenerativeNFT.json';
import { useForm } from 'react-hook-form';

import SaveCID from './SaveCID';

export default function MintNFT() {
  const [recipient, setRecipient] = useState('');
  const [URI, setURI] = useState('');
  const [link, setLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  type Input = { recipient: string; uri: string };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Input>();

  const MintNft = async () => {
    try {
      const GenerativeNFT_CONTRACT_ADDRESS: string =
        process.env.REACT_APP_GenerativeNFT_ADDRESS || '';
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const connectedContract = new ethers.Contract(
        GenerativeNFT_CONTRACT_ADDRESS,
        GenerativeNFT.abi,
        signer
      );
      const nftTxn = await connectedContract.mint(recipient, URI);
      setIsLoading(true);

      await nftTxn.wait();
      setIsLoading(false);
      setLink('https://sepolia.etherscan.io/tx/' + nftTxn.hash);
    } catch (error) {
      console.log(error);
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
      <SaveCID />
      <label className={'label'} style={label}>
        Recipient
        <Input
          style={input}
          value={recipient}
          {...register('recipient', {
            required: 'Mint先アドレスを指定してください',
            maxLength: {
              value: 42,
              message: 'アドレス長の42桁を入力してください',
            },
            minLength: {
              value: 42,
              message: 'アドレス長の42桁を入力してください',
            },
          })}
          onChange={(event) => setRecipient(event.target.value)}
        />
      </label>
      <p style={{ color: 'red' }}>{errors.recipient?.message}</p>

      <label className={'label'} style={label}>
        TokenURI
        <Input
          style={input}
          value={URI}
          {...register('uri', {
            required: 'TokenURIを指定してください',
          })}
          onChange={(event) => setURI(event.target.value)}
        />
      </label>
      <p style={{ color: 'red' }}>{errors.uri?.message}</p>
      <Button onClick={handleSubmit(MintNft)} colorScheme="teal" style={button}>
        MINT
      </Button>
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
        } else if (link) {
          return (
            <>
              <Text>Minted! transaction is </Text>
              <Link href={link} color="teal.500">
                here
              </Link>
            </>
          );
        }
      })()}
    </>
  );
}
