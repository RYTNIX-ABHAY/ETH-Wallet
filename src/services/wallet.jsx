import { ethers } from 'ethers';
import * as bip39 from 'bip39';

export function generateMnemonic() {
  return bip39.generateMnemonic();
}

export async function createWalletFromMnemonic(mnemonic) {
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const ethereumWallet = deriveEthereumWallet(seed);
  return {
    mnemonic,
    ethereum: ethereumWallet,
  };
}

function deriveEthereumWallet(seed) {
  const ethPath = "m/44'/60'/0'/0/0";
  const rootNode = ethers.HDNodeWallet.fromSeed(seed);
  const ethNode = rootNode.derivePath(ethPath);
  return {
    path: ethPath,
    privateKey: ethNode.privateKey,
    publicKey: ethNode.publicKey,
    address: ethNode.address,
  };
}