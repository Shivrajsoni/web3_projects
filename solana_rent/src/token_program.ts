import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js"
import { TOKEN_PROGRAM_ID, createMint } from "@solana/spl-token"
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
// token minting
export const payer = Keypair.fromSecretKey(Uint8Array.from([141, 86, 227, 57, 134, 206, 25, 93, 119, 22, 237, 199, 245, 109, 200, 101, 194, 52, 9, 222, 130, 223, 127, 243, 171, 213, 67, 124, 194, 98, 54, 201, 141, 253, 148, 58, 138, 242, 53, 3, 156, 182, 37, 155, 156, 14, 224, 5, 246, 193, 160, 83, 240, 47, 49, 124, 94, 155, 208, 10, 61, 48, 72, 138]));


const mintAuthority = payer;

async function createMintForToken(payer, mintAuthority) {
  const mint = await createMint(
    connection,
    payer,
    mintAuthority,
    null,
    6,
    TOKEN_PROGRAM_ID,
  );
  console.log(`Mint created at `, mint);
  return mint;
}
async function main() {
  const mint = await createMintForToken(payer, mintAuthority);
}
main();
