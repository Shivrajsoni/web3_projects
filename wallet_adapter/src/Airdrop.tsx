import { useConnection, useWallet } from "@solana/wallet-adapter-react"
const Airdrop = () => {
    const wallet = useWallet();
    const { connection } = useConnection();
    async function sendAirdroptoUser(){
        if (wallet.publicKey) {
            await connection.requestAirdrop(wallet.publicKey, 10);
        } else {
            console.error("Wallet public key is null");
        }
        alert("Successfully Airdrop");
    }

    return (
    <div>
        <input type = "text" placeholder="amount"></input>
        <button onClick={sendAirdroptoUser}>Send Airdrop</button>
    </div>
  )
}

export default Airdrop
