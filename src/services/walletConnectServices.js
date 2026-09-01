// import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export function walletStatus() {
  const { isConnected, address } = useAccount();
  return [isConnected, address];
}

{}