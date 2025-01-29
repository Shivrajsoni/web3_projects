import { createCloseAccountInstruction, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Config } from "./config";
import { ComputeBudgetProgram, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";

interface tokenAccountData {
    info:{
        isNative:false,
        mint:string,
        owner:string,
        state:string,
        tokenAmount :{
            amount :string,
            decimals :number,
            uiAmount : number,
            uiAmountString : string
        }
    }
}
const blacklist = [
    "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
];

(async function close_ata(){
    const atas = await Config.connection.getParsedTokenAccountsByOwner(Config.solWallet.publicKey,{
        programId:TOKEN_PROGRAM_ID
    })

    const inst = [
        ComputeBudgetProgram.setComputeUnitPrice({microLamports:1000}),
        ComputeBudgetProgram.setComputeUnitLimit({units:45000}),
    ]

    const block = await Config.connection.getLatestBlockhash({commitment:"processed"});
    for(const ata of atas.value.slice(0,15)){
        const data = (<tokenAccountData> ata.account.data.parsed).info;
        if(blacklist.includes(data.mint))
            continue ;

        if(data.tokenAmount.amount !=='0'){
            console.log('Skipping',data.mint);
            continue;
        }

        console.log('mint : ',data.mint);
        inst.push(
            createCloseAccountInstruction(
                ata.pubkey,
                Config.solWallet.publicKey,
                Config.solWallet.publicKey
            )
        )
        const messageV0 = new TransactionMessage({
            instructions: inst,
            payerKey: Config.solWallet.publicKey,
            recentBlockhash: block.blockhash
        }).compileToV0Message();

        const txn = new VersionedTransaction(messageV0);
        txn.sign([Config.solWallet.payer]);
        let sig = bs58.encode(txn.signatures[0]);
        console.log('sig : ',sig);
        await Config.connection.sendTransaction(txn,{
            skipPreflight: false,
            preflightCommitment:"processed",
            maxRetries:5
        })

        let res = await Config.connection.confirmTransaction({
            ...block,
            signature: sig
        },"processed");
        if(!res.value.err){
            console.log('Transaction confirmed');
        }        
    }
})();