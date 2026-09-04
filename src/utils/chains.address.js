const CHAIN_IDS = {
  SEPOLIA: 11155111,
  BASE_SEPOLIA: 84532,
  OPBNB_TESTNET: 5611,
};

const CONTRACT_ADDRESSES = {
  [CHAIN_IDS.SEPOLIA]: {
    mLend: "0x751B8eC585Ba3bdc38690e663151a7ceb4861a72",
  },
  [CHAIN_IDS.BASE_SEPOLIA]: {
    mLend: "undeployed",
  },
  [CHAIN_IDS.OPBNB_TESTNET]: {
    mLend: "undeployed",
  },
};

const TOKEN_ADDRESSES = {
  [CHAIN_IDS.SEPOLIA]: {
    usdc: {
      address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
      decimals: 6,
    },
    link: {
      address: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
      decimals: 18,
    },
    eth: {
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      decimals: 18,
    },
  },
};

export { CONTRACT_ADDRESSES, TOKEN_ADDRESSES };
