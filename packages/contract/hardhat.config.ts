import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

require('dotenv').config();

const config: HardhatUserConfig = {
  solidity: '0.8.19',
  defaultNetwork: 'hardhat',
  networks: {
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/C-VH0vGDlcq6wLx029osGt7Ah0xhuur7',
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};

export default config;
