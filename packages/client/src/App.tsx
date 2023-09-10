import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { ChakraProvider, Button, Input, Select } from '@chakra-ui/react';
import { ethers } from 'ethers';
import GenerativeNFT from './utils/GenerativeNFT.json';
function App() {
  const [count, setCount] = useState('');
  const [layer, setLayer] = useState('');
  const [recipient, setRecipient] = useState('');
  const [URI, setURI] = useState('');
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
      data.append('layer', layer);
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

  const MintNft = async () => {
    try {
      const CONTRACT_ADDRESS: string =
        process.env.REACT_APP_SEPOLIA_CONTRACT_ADDRESS || '';
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const connectedContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        GenerativeNFT.abi,
        signer
      );
      const caddress = await connectedContract.getAddress();
      console.log(caddress);

      console.log('Going to pop wallet now to pay gas...');
      const nftTxn = await connectedContract.mint(recipient, URI);
      console.log('Mining...please wait.');
      await nftTxn.wait();

      console.log(
        `Mined, see transaction: https://sepolia.etherscan.io/tx/${nftTxn.hash}`
      );
    } catch (error) {
      console.log(error);
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
      <label
        style={{
          fontSize: '20px',
          display: 'block',
          transform: 'translateY(200px)',
        }}
      >
        recipient
      </label>
      <Input
        value={recipient}
        onChange={(event) => setRecipient(event.target.value)}
        style={{
          transform: 'translateY(200px)',
          display: 'block',
        }}
      />

      <label
        style={{
          fontSize: '20px',
          display: 'block',
          transform: 'translateY(200px)',
        }}
      >
        TokenURI
      </label>
      <Input
        value={URI}
        onChange={(event) => setURI(event.target.value)}
        style={{
          transform: 'translateY(200px)',
        }}
      />

      <Button
        onClick={MintNft}
        colorScheme="teal"
        style={{
          transform: 'translateY(200px)',
        }}
      >
        MINT
      </Button>
      <Select
        value={layer}
        onChange={(event) => setLayer(event.target.value)}
        placeholder="Select option"
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
    </ChakraProvider>
  );
}

export default App;
