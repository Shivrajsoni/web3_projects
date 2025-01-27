import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

const user_address = new PublicKey('5gjLjKtBhDxWL4nwGKprThQwyzzNZ7XNAVFcEtw3rD4i');
const tokenMintAddress = new PublicKey('6NeR2StEEb6CP75Gsd7ydbiAkabdriMdixPmC2U9hcJs');

interface GetAssociatedTokenAddress {
    (mintAddress: PublicKey, ownerAddress: PublicKey): [PublicKey, number];
}

// const getAssociatedtokenAddress: GetAssociatedTokenAddress = (mintAddress, ownerAddress) => {
//     return PublicKey.findProgramAddressSync(
//         [ownerAddress.toBuffer(), TOKEN_2022_PROGRAM_ID.toBuffer(), mintAddress.toBuffer()],
//         ASSOCIATED_TOKEN_PROGRAM_ID
//     );
// };
// const [associatedtokenaddress,bump] = getAssociatedtokenAddress(tokenMintAddress,user_address);
// console.log(`Associated Token Address : ${associatedtokenaddress.toBase58()},bump:${bump}`);

// const { PublicKey } = require('@solana/web3.js');
// const { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } = require('@solana/spl-token');

const PDA = PublicKey.createProgramAddressSync(
  [user_address.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), tokenMintAddress.toBuffer(), Buffer.from([255])],
  ASSOCIATED_TOKEN_PROGRAM_ID,
);
 
console.log(`PDA: ${PDA}`);
