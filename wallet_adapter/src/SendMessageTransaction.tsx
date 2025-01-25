
import { ed25519 } from "@noble/curves/ed25519";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRef } from "react";

import bs58 from 'bs58';

const SendMessageTransaction = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { publicKey,signMessage } = useWallet();

    async function SignedMessageTransaction(){
        const message = inputRef.current ? inputRef.current.value : '';
        if(message.length>0){
            if(!publicKey){
                throw new Error(`Wallet not connected`);
            }
            if(!signMessage){
                throw new Error(`Wallet does not support Signing message`);
            }

            const encodedMessage = new TextEncoder().encode(message);
            const signature = await signMessage(encodedMessage);

            if(!ed25519.verify(signature,encodedMessage,publicKey.toBytes()))
            alert(`Message Signature : ${bs58.encode(signature)}`);
            console.log("Message Signed Successfully");
        }

    }
    function setInputRef(){
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }
  return (
    <div>
        <h1>Send Message Transaction</h1>
        <input type = "text" ref={inputRef} onChange={setInputRef} ></input>
        <button onClick={SignedMessageTransaction}>Sign Message</button>
    </div>
  )
}
export default SendMessageTransaction