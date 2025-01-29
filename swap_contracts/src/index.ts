// swap contract creating 

import { Wallet } from "@project-serum/anchor";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { Connection, Keypair, VersionedTransaction } from "@solana/web3.js";

const connection = new Connection("https://solana-devnet.g.alchemy.com/v2/T0a2jUFAXvqn3dc4Q22m92mMiclu33C4");
const wallet = new Wallet(Keypair.fromSecretKey(new Uint8Array([211,68,173,169,178,188,54,146,3,12,74,234,179,21,250,58,224,182,78,166,185,16,57,193,185,163,213,204,176,55,125,211,131,30,194,128,53,191,185,245,26,154,131,237,152,126,35,109,97,242,58,165,251,231,35,119,42,226,249,130,48,155,24,199])));

// Swapping SOL to USDC with input 0.1 SOL and 0.5% slippage

async function main(){
    const quoteResponse = await (
        await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112\
    &outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v\
    &amount=100000000\
    &slippageBps=50`)
    ).json();
    
    // get the serialized transaction for the swap
    const swapTransaction  = await (
        await fetch('https://quote-api.jup.ag/v6/swap',{
            method:'POST',
            headers:{
                'Content-type':'application/json'
            },
            body: JSON.stringify({
                quoteResponse,
                userPublicKey: wallet.publicKey.toString(),
                wrapAndunwrapSol:true,
            })
        })
    ).json();
    
    // deserialize the transaction
const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
let transaction = VersionedTransaction.deserialize(swapTransactionBuf);
console.log(transaction);

// sign the transaction
transaction.sign([wallet.payer]);

}
main();

