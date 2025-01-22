"use client";

import React, { useState, useEffect } from 'react'
import { toast } from "sonner";
import { Button } from './ui/button';
import { motion } from "framer-motion";
import { derivePath } from "ed25519-hd-key";
import bs58 from "bs58";

import { mnemonicToSeedSync , generateMnemonic , validateMnemonic} from "bip39";
import nacl from 'tweetnacl';
import { Keypair } from '@solana/web3.js';

interface Wallet {
  publicKey: string;
  privateKey: string;
  mnemonic: string;
  path: string;
}
const WalletGenerator = () => {
  const [mnemonicWords, setMnemonicWords] = useState<string[]>(Array(12).fill(" "));
  const [pathTypes, setPathTypes] = useState<string[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [showMnemonic, setShowMnemonic] = useState<boolean>(false);
  const [mnemonicInput, setMnemonicInput] = useState<string>("");
  const [visiblePrivateKeys, setVisiblePrivateKeys] = useState<boolean[]>([]);
  const [visiblePhrases, setVisiblePhrases] = useState<boolean[]>([]);
  const [gridView, setGridView] = useState<boolean>(false);
  const pathTypeNames: { [key: string]: string } = {
    "501": "Solana",
    "60": "Ethereum",
  };

  useEffect(() => {
    const storedWallets = localStorage.getItem("wallets");
    const storedMnemonic = localStorage.getItem("mnemonics");
    const storedPathTypes = localStorage.getItem("paths");

    if (storedWallets && storedMnemonic && storedPathTypes) {
      setMnemonicWords(JSON.parse(storedMnemonic));
      setWallets(JSON.parse(storedWallets));
      setPathTypes(JSON.parse(storedPathTypes));
      setVisiblePrivateKeys(JSON.parse(storedWallets).map(() => false));
      setVisiblePhrases(JSON.parse(storedWallets).map(() => false));
    }
  }, []);

  const handleDeleteWallet = (index: number) => { 
      const updatedwallet = wallets.filter((_,i)=>i!==index);
      const updatedPathTypes = pathTypes.filter((_,i)=>i!==index);
      setWallets(updatedwallet);
      setPathTypes(updatedPathTypes);
      localStorage.setItem("wallets",JSON.stringify(updatedwallet));
      localStorage.setItem("paths",JSON.stringify(updatedPathTypes));
      setVisiblePrivateKeys(visiblePrivateKeys.filter((_,i)=> i!==index));
      setVisiblePhrases(visiblePhrases.filter((_,i)=>i!==index));
      toast.success("Wallet deleted Successully!");
    };

  const handleClearWallet = () => {
    localStorage.removeItem("wallets");
    localStorage.removeItem("mnemonics");
    localStorage.removeItem("paths");
    setWallets([]);
    setMnemonicWords([]);
    setPathTypes([]);
    setVisiblePrivateKeys([]);
    setVisiblePhrases([]);
    toast.success("Clear Wallet")
   };

  const copyToClipboard = (content: string) => { 
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  };

  const togglePrivateKeyVisibility = (index: number) => {
    setVisiblePrivateKeys(
      visiblePrivateKeys.map((visible,i)=> (i===index ?!visible:visible))
    )
   };

  const togglePhraseVisibility = (index: number) => {
    setVisiblePhrases(
      visiblePhrases.map((visible,i)=>(i=== index ? !visible : visible))
    )
   };

  const generateWalletFromMnemonic = (
    pathType: string,
    mnemonic: string,
    accountIndex: number
  ): Wallet | null => {
    try {
      const seedBuffer = mnemonicToSeedSync(mnemonic);
      const path = `m/44/${pathType}'/0'/${accountIndex}`;
      const { key:derivedSeed} = derivePath(path,seedBuffer.toString("hex"));

      let publicKeyEncoded :string ="" ;
      let privateKeyEncoded :string = "";

      if(pathType ==="501"){

        // solana
        const { secretKey } = nacl.sign.keyPair.fromSeed(derivedSeed);
        const keypair = Keypair.fromSecretKey(secretKey);
        
        privateKeyEncoded = bs58.encode(secretKey);
        publicKeyEncoded = keypair.publicKey.toBase58();

      }else if(pathType ==="60"){
        // etherium
        const privateKey = Buffer.from(derivedSeed).toString("hex");
        priva

      }else{
        toast.error("Unsupported path type .");
        return null;
      }
      return {
        publicKey:publicKeyEncoded,
        privateKey:privateKeyEncoded,
        mnemonic,
        path,
      }

    } catch (error:unknown) {
      toast.error("Failed to generate Wallet From Mnemonic, Please try again later");
      return null;
    }
  }

  const handleGenerateWallet = () => {

  }

  const handleAddWallet = () => {

  }
  return (
    <></>
  )


}

export default WalletGenerator


