import React from 'react';
import logo from './logo.svg';
import '../App.css';
import { useState } from 'react';
import { Button, Input } from '@chakra-ui/react';
import { Spinner, Text, SimpleGrid, Link } from '@chakra-ui/react';
import { selectAnatomy } from '@chakra-ui/anatomy';
import { FcVideoFile, FcUpload, FcLowPriority } from 'react-icons/fc';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(selectAnatomy.keys);
import { ethers } from 'ethers';
import GenerativeOnchainNFT from '../utils/GenerativeOnchainNFT.json';
import { useForm } from 'react-hook-form';

export default function MintOnchainNFT() {
  const [onchainRecipient, setOnchainRecipient] = useState('');
  const [onchainLink, setOnchainLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  type Input = { onchainRecipient: string };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Input>();

  const MintOnchainNft = async () => {
    try {
      const GenerativeOnchainNFT_CONTRACT_ADDRESS: string =
        process.env.REACT_APP_GenerativeOnchainNFT_ADDRESS || '';
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const ContractedGenerativeOnchainNFT = new ethers.Contract(
        GenerativeOnchainNFT_CONTRACT_ADDRESS,
        GenerativeOnchainNFT.abi,
        signer
      );
      const onchainNftTxn =
        await ContractedGenerativeOnchainNFT.mint(onchainRecipient);
      setIsLoading(true);

      await onchainNftTxn.wait();
      setIsLoading(false);
      setOnchainLink('https://sepolia.etherscan.io/tx/' + onchainNftTxn.hash);
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
      <label className={'label'} style={label}>
        Recipient
        <Input
          style={input}
          value={onchainRecipient}
          {...register('onchainRecipient', {
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
          onChange={(event) => setOnchainRecipient(event.target.value)}
        />
      </label>
      <p style={{ color: 'red' }}>{errors.onchainRecipient?.message}</p>
      <Button
        onClick={handleSubmit(MintOnchainNft)}
        colorScheme="teal"
        style={button}
      >
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
        } else if (onchainLink) {
          return (
            <>
              <Text>Minted! transaction is </Text>
              <Link href={onchainLink} color="teal.500">
                here
              </Link>
            </>
          );
        }
      })()}
    </>
  );
}
