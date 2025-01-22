import { mnemonicToSeed } from 'bip39';
import React, { useState } from 'react'
import { derivePath } from 'ed25519-hd-key';
import { Keypair } from '@solana/web3.js';
import nacl from 'tweetnacl';

export const SolanaWallet = ({ mnemonic }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [publicKey, setPublicKey] = useState([]);
  return (
    <div>
      <button onClick={
        function () {
          const seed = mnemonicToSeed(mnemonic);
          const path = `m/44'/501'/${currentIndex}'/0'`;
          const derivedSeed = derivePath(path, seed.toString("hex")).key;
          const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
          const keypair = Keypair.fromSecretKey(secret);
          setCurrentIndex(currentIndex + 1);
          setPublicKey([...publicKey, keypair.publicKey])
        }
      }>
        Add SolanaWallet
      </button>
      {publicKey.map(p =>
        <div>
          {p.toBase58()}
        </div>
      )}
    </div>
  )
}


