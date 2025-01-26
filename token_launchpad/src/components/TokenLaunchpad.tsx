import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import {  TOKEN_2022_PROGRAM_ID, getMintLen, ExtensionType, TYPE_SIZE, LENGTH_SIZE, createInitializeMetadataPointerInstruction, createInitializeMintInstruction} from "@solana/spl-token";
import { createInitializeInstruction, pack, TokenMetadata } from '@solana/spl-token-metadata';

const TokenLaunchpad = () => {

    const { connection } = useConnection();
    const wallet = useWallet();

    async function createToken(){
    const mintKeypair = Keypair.generate();
    const mint  = mintKeypair.publicKey;
    const mintAuthority = wallet.publicKey!;
    const updateAuthority = wallet.publicKey!;

    
    const metadata:TokenMetadata = {
      mint: mintKeypair.publicKey,
      name: 'SHIBU',
      symbol: 'SHB    ',
      uri: 'https://cdn.100xdevs.com/metadata.json',
      additionalMetadata: [["desc","Only on Solana"]],
    };
    const mintLen = getMintLen([ExtensionType.MetadataPointer]);
    const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
    const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);
    
    // Instruction to invoke a new account using system program
    if (!wallet.publicKey) {
        throw new Error("Wallet not connected");
    }

    const transaction = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: wallet.publicKey,
            newAccountPubkey: mintKeypair.publicKey,
            space: mintLen,
            lamports,
            programId: TOKEN_2022_PROGRAM_ID,
        }),
    )
    //Instruction to Initalize MetaData pointer extension
      createInitializeMetadataPointerInstruction(
      mint,
      updateAuthority,
      mint,
      TOKEN_2022_PROGRAM_ID
    )

    // instruction to initalize Mint Account Data
     createInitializeMintInstruction(
      mint,
      9,
      mint,
      null,
      TOKEN_2022_PROGRAM_ID
    )

    // instruction to initaliaze Metadata account data
     createInitializeInstruction({
      programId:TOKEN_2022_PROGRAM_ID,
      metadata:mint,
      mint:mint,
      name:metadata.name,
      symbol:metadata.symbol,
      uri:metadata.uri,
      mintAuthority:mintAuthority,
      updateAuthority:updateAuthority,
    })
  
    transaction.feePayer = mint;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.partialSign(mintKeypair);

    await wallet.sendTransaction(transaction,connection);
    }
  
  return (
    <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    }}>
        <h1>Solana Token Launchpad</h1>
        <input className='inputText' type='text' id = "name" placeholder='Name'></input> <br />
        <input className='inputText' type='text' id = "symbol" placeholder='Symbol'></input> <br />
        <input className='inputText' type='text' id = "image" placeholder='Image URL'></input> <br />
        <input className='inputText' type='text' id = "initialSupply" placeholder='Initial Supply'></input> <br />
        <button className='btn' onClick={createToken} disabled={!wallet.publicKey}>Create a token</button>
    </div>
  )
}

export default TokenLaunchpad
