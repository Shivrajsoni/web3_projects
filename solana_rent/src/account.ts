// account creation in solana with some data
import { clusterApiUrl, Connection, Keypair, sendAndConfirmTransaction, SystemInstruction, SystemProgram, Transaction, TransactionExpiredBlockheightExceededError, } from "@solana/web3.js";
import fs from "fs";

const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// genereting a new Keypair for the account
const dataAccount = Keypair.generate();
const payer = Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync(`/root/.config/solana/id.json`, 'utf-8'))));

async function createAccount() {
  // create a transaction to create and fund the account
  const tx = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: dataAccount.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(1000),
      space: 1000,
      programId: SystemProgram.programId
    })
  );
  // Send the transaction to the network
  const txId = await sendAndConfirmTransaction(connection, tx, [payer, dataAccount]);

  console.log(`Created account with transaction ID: ${txId}`);
};

createAccount();
