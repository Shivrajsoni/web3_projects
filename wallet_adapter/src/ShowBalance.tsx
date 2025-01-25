import { useWallet,useConnection } from "@solana/wallet-adapter-react"
import { useState } from "react";


const ShowBalance = () => {
    const {connection} = useConnection();

    const {publicKey} = useWallet();
    const [balance, setBalance] = useState(0);

    async function getBalance (){
        if(publicKey){
            const account_balance = await connection.getBalance(publicKey);
            setBalance(account_balance);
        }
    }
    getBalance();
  return (
    <div>
        <h1>Balance : {balance/1e9} </h1>
    </div>
  )
}

export default ShowBalance
