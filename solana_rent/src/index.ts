import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

(async () => {
  const dataSize = 16;
  const minBalance = await connection.getMinimumBalanceForRentExemption(dataSize);
  console.log(`Rent Exempt minimum : ${minBalance / LAMPORTS_PER_SOL} SOL`)
})();
