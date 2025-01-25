import { createMint, createMultisig, getOrCreateAssociatedTokenAccount, mintTo, MultisigLayout } from "@solana/spl-token";
import { Keypair } from "@solana/web3.js";
import { connection } from ".";

const signer1 = Keypair.generate();
const signer2 = Keypair.generate();
const signer3 = Keypair.generate();

export const payer = Keypair.fromSecretKey(Uint8Array.from([141, 86, 227, 57, 134, 206, 25, 93, 119, 22, 237, 199, 245, 109, 200, 101, 194, 52, 9, 222, 130, 223, 127, 243, 171, 213, 67, 124, 194, 98, 54, 201, 141, 253, 148, 58, 138, 242, 53, 3, 156, 182, 37, 155, 156, 14, 224, 5, 246, 193, 160, 83, 240, 47, 49, 124, 94, 155, 208, 10, 61, 48, 72, 138]));
console.log(signer1.publicKey.toBase58());
console.log(signer2.publicKey.toBase58());
console.log(signer3.publicKey.toBase58());

async function main() {
  const multisigKey = await createMultisig(connection, payer, [signer1.publicKey, signer2.publicKey, signer3.publicKey], 2);
  console.log(` Created multisig 2/3 account :${multisigKey} `);
  const mint = await createMint(connection, payer, multisigKey, multisigKey, 9);
  const associatedTokenAccount = await getOrCreateAssociatedTokenAccount(connection, payer, mint, signer1.publicKey);
  try {
    await mintTo(
      connection,
      payer,
      mint,
      associatedTokenAccount.address,
      multisigKey,
      1
    )
  } catch (error) {
    console.log(error);
  }
};

main();

