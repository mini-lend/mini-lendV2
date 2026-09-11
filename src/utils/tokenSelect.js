import { TOKEN_ADDRESSES, NATIVE_TOKENS } from "./chains.address";

export function getTokenSymbol(chainId, tokenAddress) {
//   console.log(
//     "token Address:",
//     tokenAddress,
//     "Address Type:",
//     typeof tokenAddress,
//   );

  const nativeToken = NATIVE_TOKENS[chainId];

  if (
    !tokenAddress ||
    tokenAddress === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
  ) {
    return nativeToken?.symbol ?? "UNKNOWN";
  }

  //   return TOKEN_ADDRESSES[chainId]?.[tokenAddress]?.symbol ?? "UNKNOWN";
  const tokens = TOKEN_ADDRESSES[chainId];

  if (!tokens) {
    return "UNKNOWN";
  }

  const token = Object.values(tokens).find(
    (token) => token.address.toLowerCase() === tokenAddress.toLowerCase(),
  );

  return token?.symbol ?? "UNKNOWN";
}

// usage example
// const symbol = getTokenSymbol(
//   102031,
//   "0x498482e334269a10d0621D3AC5e726734B01DDCe"
// );

// console.log(symbol);
// // ccUSDC
