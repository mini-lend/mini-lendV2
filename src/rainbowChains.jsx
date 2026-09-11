import { sepolia } from "wagmi/chains";

export const creditcoinTestnet = {
  id: 102031,
  name: "Creditcoin Testnet",
  nativeCurrency: {
    name: "Creditcoin Testnet",
    symbol: "tCTC",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.cc3-testnet.creditcoin.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "Creditcoin Explorer",
      url: "https://creditcoin-testnet.blockscout.com",
    },
  },
  testnet: true,
};

export const supportedChains = [
  sepolia,
  creditcoinTestnet,
];