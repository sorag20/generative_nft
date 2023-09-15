import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { ChakraProvider, Button, Input, Select } from '@chakra-ui/react';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  Spinner,
  Text,
  SimpleGrid,
  Link,
} from '@chakra-ui/react';
import { selectAnatomy } from '@chakra-ui/anatomy';
import { FcVideoFile, FcUpload, FcLowPriority } from 'react-icons/fc';
import { extendTheme } from '@chakra-ui/react';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(selectAnatomy.keys);
import { ethers } from 'ethers';
import GenerativeNFT from './utils/GenerativeNFT.json';
import GenerativeOnchainNFT from './utils/GenerativeOnchainNFT.json';

function App() {
  const [count, setCount] = useState('');
  const [layer, setLayer] = useState('');
  const [recipient, setRecipient] = useState('');
  const [onchainRecipient, setOnchainRecipient] = useState('');
  const [URI, setURI] = useState('');
  const [link, setLink] = useState('');
  const [onchainLink, setOnchainLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [generateSuccess, setGenerateSuccess] = useState('');
  const [layerSuccess, setLayerSuccess] = useState('');

  const handleSubmit = async () => {
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
        await ContractedGenerativeOnchainNFT.mint(recipient);
      setIsLoading(true);

      await onchainNftTxn.wait();
      setIsLoading(false);
      setOnchainLink('https://sepolia.etherscan.io/tx/' + onchainNftTxn.hash);
    } catch (error) {
      console.log(error);
    }
  };

  const tabs = {
    width: '700px',
    margin: '200px',
  };
  const heading = {
    transform: 'translate(50px,150px)',
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
  const selectAnatomy = definePartsStyle({
    field: {
      width: '300px',
      transform: 'translateY(10px)',
    },
    icon: {
      transform: 'translateX(-100px)',
    },
  });
  const select = {
    width: '300px',
  };
  const grid = {
    transform: 'translateY(15px)',
  };

  return (
    <ChakraProvider>
      <Heading style={heading}>Generative NFT</Heading>
      <Tabs style={tabs} size="md" align="center" variant="soft-rounded">
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
          <Tab>
            <FcLowPriority />
            Mint Onchain NFT
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <label>
              Genetate Count
              <Input
                style={input}
                type="text"
                className={'count'}
                value={count}
                onChange={(event) => setCount(event.target.value)}
              />
            </label>
            <Button
              style={button}
              onClick={handleSubmit}
              colorScheme="teal"
              type="submit"
            >
              Generate
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
              } else if (generateSuccess) {
                return (
                  <>
                    <Text>{generateSuccess}!</Text>
                  </>
                );
              }
            })()}
          </TabPanel>
          <TabPanel>
            <form onSubmit={imgSubmit}>
              <SimpleGrid style={grid} minChildWidth="200px" spacing="40px">
                <Input
                  type="file"
                  name="file"
                  accept="image/*,.png,.jpg,.jpeg,.gif"
                  onChange={(event) => getImage(event.target)}
                />
                <Select
                  style={select}
                  value={layer}
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
          </TabPanel>
          <TabPanel>
            <label className={'label'} style={label}>
              Recipient
              <Input
                style={input}
                value={recipient}
                onChange={(event) => setRecipient(event.target.value)}
              />
            </label>

            <label className={'label'} style={label}>
              TokenURI
              <Input
                style={input}
                value={URI}
                onChange={(event) => setURI(event.target.value)}
              />
            </label>

            <Button onClick={MintNft} colorScheme="teal" style={button}>
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
          </TabPanel>
          <TabPanel>
            <label className={'label'} style={label}>
              Recipient
              <Input
                style={input}
                value={onchainRecipient}
                onChange={(event) => setOnchainRecipient(event.target.value)}
              />
            </label>
            <Button onClick={MintOnchainNft} colorScheme="teal" style={button}>
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
          </TabPanel>
        </TabPanels>
      </Tabs>
    </ChakraProvider>
  );
}

export default App;
