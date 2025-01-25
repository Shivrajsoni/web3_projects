import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { useRef } from "react";
import {LAMPORTS_PER_SOL,Transaction,SystemProgram, PublicKey} from "@solana/web3.js";

const SendingSolana = () => {
    const {connection} = useConnection();
    const wallet = useWallet();
    const amountRef = useRef<HTMLInputElement>(null);
    const receiverRef = useRef<HTMLInputElement>(null);

    async function sendSolana(){
        if(wallet.publicKey){
            const amount = amountRef.current?.value;
            const receiver = receiverRef.current?.value;
            if (receiver) {
                const transaction = new Transaction();
                transaction.add(SystemProgram.transfer({
                    fromPubkey: wallet.publicKey,
                    toPubkey: new PublicKey(receiver),
                    lamports: amount ? parseInt(amount) * LAMPORTS_PER_SOL : 0
                }))
                await wallet.sendTransaction(transaction, connection);
                alert("Send " + amount + " to " + receiver);
                console.log('transaction has been done');
            } else {
                console.error("Receiver public key is undefined");
            }
        }
    }

  return (
    <div>
      <input type = "text" ref = {receiverRef} placeholder=" Reciever public key" ></input>
      <input type = "text" ref = {amountRef} placeholder="amount"></input>
      <button onClick={sendSolana}>Send SOL</button>
    </div>
  )
}

export default SendingSolana
