import { ethers } from 'ethers';

// API
const ETH_RPC_URL="https://go.getblock.us/87f8499b08644a99ba69ee7abd57d6a7";

//Bal 
export async function getEthBalance(address) {
  const provider = new ethers.JsonRpcProvider(ETH_RPC_URL);
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
}

//trans
export async function sendEth(privateKey, to, amountStr) {
  const provider = new ethers.JsonRpcProvider(ETH_RPC_URL);
  const wallet = new ethers.Wallet(privateKey, provider);
  const tx = await wallet.sendTransaction({ to, value: ethers.parseEther(amountStr) });
  await tx.wait();
  return tx.hash;
}