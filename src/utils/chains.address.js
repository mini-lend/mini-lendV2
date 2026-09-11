const CHAIN_IDS = {
  SEPOLIA: 11155111,
  CREDITCOIN_TESTNET: 102031,
  BASE_SEPOLIA: 84532,
  OPBNB_TESTNET: 5611,
};

const CONTRACT_ADDRESSES = {
  [CHAIN_IDS.SEPOLIA]: {
    mLend: "0x751B8eC585Ba3bdc38690e663151a7ceb4861a72",
  },
  [CHAIN_IDS.CREDITCOIN_TESTNET]: {
    mLend: "0xc49c0457c656B901324cB7f9b6736D80f1DBD28B",
  },
  [CHAIN_IDS.BASE_SEPOLIA]: {
    mLend: "undeployed",
  },
  [CHAIN_IDS.OPBNB_TESTNET]: {
    mLend: "undeployed",
  },
};

// const TOKEN_ADDRESSES = {
//   [CHAIN_IDS.SEPOLIA]: {
//     usdc: {
//       address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
//       decimals: 6,
//     },
//     link: {
//       address: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
//       decimals: 18,
//     },
//     eth: {
//       address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
//       decimals: 18,
//     },
//   },
//   [CHAIN_IDS.CREDITCOIN_TESTNET]: {
//     ccUSDC: {
//       address: "0x498482e334269a10d0621D3AC5e726734B01DDCe",
//       decimals: 6,
//     },
//     ccUSDT: {
//       address: "0x12E931FfD868dF8b8f31AaD47422674cA158D62c",
//       decimals: ,
//     },
//     eth: {
//       address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
//       decimals: 18,
//     },
//   },

// };
const NATIVE_TOKENS = {
  [CHAIN_IDS.SEPOLIA]: {
    symbol: "ETH",
    decimals: 18,
  },

  [CHAIN_IDS.CREDITCOIN_TESTNET]: {
    symbol: "tCTC",
    decimals: 18,
  },

  [CHAIN_IDS.BASE_SEPOLIA]: {
    symbol: "ETH",
    decimals: 18,
  },

  [CHAIN_IDS.OPBNB_TESTNET]: {
    symbol: "BNB",
    decimals: 18,
  },
};

const TOKEN_ADDRESSES = {
  [CHAIN_IDS.SEPOLIA]: {
    usdc: {
      address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
      symbol: "USDC",
      decimals: 6,
    },

    link: {
      address: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
      symbol: "LINK",
      decimals: 18,
    },
  },

  [CHAIN_IDS.CREDITCOIN_TESTNET]: {
    ccUSDC: {
      address: "0x498482e334269a10d0621D3AC5e726734B01DDCe",
      symbol: "ccUSDC",
      decimals: 6,
    },

    ccUSDT: {
      address: "0x12E931FfD868dF8b8f31AaD47422674cA158D62c",
      symbol: "ccUSDT",
      decimals: 6,
    },
  },
};

export { CHAIN_IDS, CONTRACT_ADDRESSES, TOKEN_ADDRESSES, NATIVE_TOKENS };

// == Return ==
// lend: contract MiniLend 0xc49c0457c656B901324cB7f9b6736D80f1DBD28B
// ccUSDC: contract MockERC20 0x498482e334269a10d0621D3AC5e726734B01DDCe
// ccUSDT: contract MockERC20 0x12E931FfD868dF8b8f31AaD47422674cA158D62c
// ethFeed: contract MockAggregator 0xbDE30096C2bF9f571273db98CAEb93f2c03fCdcC
// usdcFeed: contract MockAggregator 0xF1f095d12e6Dc2A1E43AE66a906341A9e66AaC4D
// usdtFeed: contract MockAggregator 0xDBBe4b5e23e98F16537ACAF59a49064F3011CE11

// 2nd deployment
// == Return ==
// lend: contract MiniLend 0x6F32655AaAd155A2427255A4D4d88A018cD00978
// ccUSDC: contract MockERC20 0xb1449037159ec2D145D9C627ffe026363113A6D8
// ccUSDT: contract MockERC20 0x0D8bD407205c537C7F926388789049AbAF22A229
// ethFeed: contract MockAggregator 0x8A4716Eb11474DfF66E639eaaae11aD209fDDC6f
// usdcFeed: contract MockAggregator 0x47Af9cb6cbC31D1D975BB80fC3Ced09e3504eE45
// usdtFeed: contract MockAggregator 0xBB423ee70820c486F737066fd5865e5e4B40FE99
