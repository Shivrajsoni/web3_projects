import { Wallet } from "@project-serum/anchor";
import { Connection, Keypair } from "@solana/web3.js";
import * as dotenv from "dotenv";
dotenv.config();


export class Config {
    public static RPC_URL :string = process.env.RPC_URL || "default_rpc_url"

    public static solWallet = new Wallet(
        Keypair.fromSeed(
            Uint8Array.from(
                JSON.parse(process.env.WALLET || '[]')
            ).slice(0,32)
        )
    );

    public static connection = new Connection(Config.RPC_URL,{
        commitment:"processed"
    })
}
