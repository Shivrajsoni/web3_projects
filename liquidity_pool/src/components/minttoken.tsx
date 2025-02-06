import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createMintToInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';

const MintToken = ({ mintAddress, onDone }) => {

  const wallet = useWallet();
  const { connection } = useConnection();

  // getting associated token Address
  async function mint() {
    const associatedtokenaddress = getAssociatedTokenAddress({
      mintAddress,
      wallet.publicKey,
      false,
      TOKEN_PROGRAM_ID
    });

    console.log(associatedtokenaddress);

    // now we will start minting token 
    const transaction = new Transaction().add({
      createAssociatedTokenAccountInstruction(
        wallet.publicKey,
      associatedtokenaddress,
      wallet.publicKey,
      mintAddress,
      TOKEN_PROGRAM_ID
      )
  });

  await wallet.sendTransaction(Transaction, connection);

  const MintTransaction = await new Transaction().add(
    createMintToInstruction(mintAddress, associatedtokenaddress, wallet.publicKey, 1000000, [], TOKEN_PROGRAM_ID);
    )

await wallet.sendTransaction(MintTransaction, connection);

  }
onDone();

}

export default MintToken;
