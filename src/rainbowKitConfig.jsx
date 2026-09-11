"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { supportedChains } from "./rainbowChains";


const config = getDefaultConfig({
  appName: "mini_LendV2",
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
  chains: supportedChains,
  ssr: false, // If your dApp uses server side rendering (SSR)
});

export { config };
