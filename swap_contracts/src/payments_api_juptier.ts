//Jupiter's Payments API supports your payments use case. Utilize Jupiter + SolanaPay to pay for anything with any SPL token. With the Jupiter Payments API, you can specify an exact output token amount. The API doesn't just support output token to USDC, but to any SPL token!

import { Connection, PublicKey, VersionedTransaction, Keypair } from "@solana/web3.js";

//Bob is selling a delicious latte for 5 USDC. Alice wants to buy Bob's latte. The problem is, Alice only holds mSOL. Luckily, Bob can use the Jupiter Payments API to let Alice swap for exactly 5 USDC then transfer 5 USDC to his payment wallet.

// First, we need to show Alice how much mSOL she will have to spend for the latte. To do this we use the GET /quote endpoint.

// Then Bob creates the transaction with the POST /swap endpoint, and adds a 5 USDC token transfer from Alice to his payment wallet using the destinationTokenAccount argument, which Alice will verify, sign and send.

import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
const USDC_MINT = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
const bobWalletPublicKey = new PublicKey("9pqcXTXo1FXJZ5bCXyCH3GBhhPjtnkVwUo9xrx6dyJzS");

const connection = new Connection("https://api.mainnet-beta.solana.com");

const feesAccount = new PublicKey("AZGkcaAvYVTrfzxdHNvhB4DUxeyenEwrmRtKYHUpZNdX");
const trackingAccount = new PublicKey("AZGkcaAvYVTrfzxdHNvhB4DUxeyenEwrmRtKYHUpZNdX");

// Ensure these are valid base58 strings
// console.log("USDC_MINT:", USDC_MINT.toBase58());
// console.log("bobWalletPublicKey:", bobWalletPublicKey.toBase58());
// console.log("feeAccount:", feesAccount.toBase58());
// console.log("trackingAccount:", trackingAccount.toBase58());

// Get the associated token account for Bob's wallet
async function getBobUSDCTokenAccount(bobWalletPublicKey:PublicKey) {
    const bobUSDCTokenAccount = await getAssociatedTokenAddress(
      USDC_MINT,
      bobWalletPublicKey,
      true,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
    return bobUSDCTokenAccount;
  }
  
  // step-1 fetching swap info
  async function fetchswapInfo(){
    const response = await fetch('https://quote-api.jup.ag/v6/quote?inputMint=mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=5000000&swapMode=ExactOut&slippageBps=50');
    const data = await response.json();
    return {
      inAmount: data.inAmount,
      otherAmountThreshold: data.otherAmountThreshold,
      quoteResponse: data
    };

  } 
  // step-2 fetching the swap transaction
  async function fetchswapTransaction(swapUserKeypair,bobUSDCTokenAccount,swapInfo){
    const requestBody = {
        userPublicKey : swapUserKeypair.publicKey.toBase58(),
        wrapAndUnwrapSol : true,
        useSharedAccounts : true,
        feesAccount:feesAccount.toBase58(),
        trackingAccount:trackingAccount.toBase58(),
        prioritizationfeesLamports :0,
        asLegacyTransaction:false,
        useTokenLedger:false,
        destinationTokenAccount: bobUSDCTokenAccount.toBase58(),
        dynamicComputeUnitLimit : true,
        skipUserAccountRpcCalls : true,
        quoteResponse : swapInfo.quoteResponse
    };
    const response = await fetch('https://quote-api.jup.ag/v6/swap',{
        method:'POSTgit',
        headers:{
            'Content-type':'application/json'
        },
        body:JSON.stringify(requestBody),
    })

    const { swapTransaction , lastValidBlockHeight} = await response.json();
    return {swapTransaction , lastValidBlockHeight};
  }
  //step-3 send the transaction to the solana blockchain
  async function sendTransaction(swapTransaction, swapUserKeypair, lastValidBlockHeight)
  {
    const transaction = VersionedTransaction.deserialize(Buffer.from(swapTransaction,'base64'));
      // Get the recent blockhash
        // Using 'finalized' commitment to ensure the blockhash is final and secure
    // You may experiment with 'processed' or 'confirmed' for fetching blockhash to increase speed
    // Reference: https://solana.com/docs/rpc/http/getlatestblockhash

    const bhInfo = await connection.getLatestBlockhashAndContext({commitment:"finalized"});
    transaction.recentBlockhash = bhInfo.value.blockhash;
    transaction.feePayer = swapUserKeypair.publicKey;

      // Sign the transaction with the swap user's keypair
    transaction.sign([swapUserKeypair]);
     // Simulate the transaction to ensure it will succeed
     // Using 'finalized' commitment for the simulation to match the security level of the actual send
    // You may experiment with 'confirmed' or 'processed' to simulate faster, but keep in mind the risks
    // Reference: https://solana.com/docs/core/transactions#commitment
  const simulation = await connection.simulateTransaction(transaction, { commitment: "finalized" });
  if (simulation.value.err) {
    throw new Error(`Simulation failed: ${simulation.value.err.toString()}`);
  }

  // Send the transaction
  try {
    const signature = await connection.sendTransaction(transaction, {
      // NOTE: Adjusting maxRetries to a lower value for trading, as 20 retries can be too much
      // Experiment with different maxRetries values based on your tolerance for slippage and speed
      // Reference: https://solana.com/docs/core/transactions#retrying-transactions
      maxRetries: 5,
      skipPreflight: true,
      preflightCommitment: "finalized",
    });

    // Confirm the transaction
    // Using 'finalized' commitment to ensure the transaction is fully confirmed
    // Reference: https://solana.com/docs/core/transactions#confirmation
    const confirmation = await connection.confirmTransaction({
      signature,
      blockhash: bhInfo.value.blockhash,
      lastValidBlockHeight: bhInfo.value.lastValidBlockHeight,
    }, "finalized");

    if (confirmation.value.err) {
      throw new Error(`Transaction not confirmed: ${confirmation.value.err.toString()}`);
    }

    console.log("Confirmed: ", signature);
  } catch (error) {
    console.error("Failed: ", error);
    throw error;
  }
}

// Example usage
(async () => {
    try {
      // Generate keypairs for swap user and Bob's wallet, replace with actual keypairs for real usage
      const swapUserKeypair = Keypair.generate();
  
      // Ensure the bobUSDCTokenAccount is correct
      const bobUSDCTokenAccount = await getBobUSDCTokenAccount(bobWalletPublicKey);
  
      // Step 1: Fetch swap info
      const swapInfo = await fetchswapInfo();
  
      // Step 2: Fetch the swap transactions
      const { swapTransaction, lastValidBlockHeight } = await fetchswapTransaction(swapUserKeypair, bobUSDCTokenAccount, swapInfo);
  
      // Step 3: Send the transaction to the blockchain
      await sendTransaction(swapTransaction, swapUserKeypair, lastValidBlockHeight);
    } catch (error) {
      console.error('Error:', error);
    }
  })();