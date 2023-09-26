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
} from '@chakra-ui/react';

import { FcVideoFile, FcUpload, FcLowPriority } from 'react-icons/fc';

import GenerateImage from './components/GenerateImage';
import UploadLayer from './components/UploadLayer';
import MintNFT from './components/MintNFT';
import MintOnchainNFT from './components/MintOnchainNFT';
function App() {
  const tabs = {
    width: '700px',
    margin: '200px',
  };
  const heading = {
    transform: 'translate(50px,150px)',
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
            <GenerateImage />
          </TabPanel>
          <TabPanel>
            <UploadLayer />
          </TabPanel>
          <TabPanel>
            <MintNFT />
          </TabPanel>
          <TabPanel>
            <MintOnchainNFT />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </ChakraProvider>
  );
}

export default App;
