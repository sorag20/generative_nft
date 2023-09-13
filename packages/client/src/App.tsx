import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { ChakraProvider, Button, Input, Select } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { ArrowUpDownIcon, ArrowUpIcon } from '@chakra-ui/icons';
import { FcVideoFile, FcUpload, FcLowPriority } from 'react-icons/fc';
import { AiOutlineUpload } from 'react-icons/ai';

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
      <Tabs size="md" align="center" variant="enclosed">
        <TabList>
          <Tab>
            <FcVideoFile />
            Generate Image
          </Tab>
          <Tab>
            <FcUpload />
            Upload Layer
          </Tab>
          <Tab>
            <FcLowPriority />
            Mint NFT
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <label className={'label'}>生成画像数</label>
            <Input
              type="text"
              className={'count'}
              value={count}
              onChange={(event) => setCount(event.target.value)}
            />
            <Button onClick={handleSubmit} colorScheme="teal" type="submit">
              Generate
            </Button>
          </TabPanel>
          <TabPanel>
            <form onSubmit={imgSubmit}>
              <input
                type="file"
                name="file"
                accept="image/*,.png,.jpg,.jpeg,.gif"
                onChange={(event) => getImage(event.target)}
              />
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
              <Button type="submit" colorScheme="teal">
                submit
              </Button>
            </form>
          </TabPanel>
          <TabPanel>
            <label className={'label'}>recipient</label>
            <Input
              value={recipient}
              onChange={(event) => setRecipient(event.target.value)}
            />

            <label className={'label'}>TokenURI</label>
            <Input
              value={URI}
              onChange={(event) => setURI(event.target.value)}
            />

            <Button onClick={MintNft} colorScheme="teal">
              MINT
            </Button>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </ChakraProvider>
  );
}

export default App;
