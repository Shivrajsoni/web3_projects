import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { payer } from "./multisigAccount"; 
import { connection } from ".";
const mintAuthority = payer;

async function SystemProgram_with_data(){
const new_account = Keypair.generate();
const TOTAL_BYTES = 169;
const lamports = await connection.getMinimumBalanceForRentExemption(TOTAL_BYTES);
const transaction = new Transaction();
transaction.add(
    SystemProgram.createAccount({
        fromPubkey:payer.publicKey,
        newAccountPubkey:new_account.publicKey,
        lamports:lamports,
        space:TOTAL_BYTES,
        programId:SystemProgram.programId
    })
)
await connection.sendTransaction(transaction,[payer,new_account]);
console.log(`New Account Created at ${new_account.publicKey.toBase58()}`);

}
SystemProgram_with_data();