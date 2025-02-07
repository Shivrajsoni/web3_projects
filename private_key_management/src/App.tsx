import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js"
import axios from "axios";



function App() {

  const connection = new Connection("");

  async function sendTransaction() {
    const instruction = SystemProgram.transfer({
      fromPubkey: new PublicKey(""),
      toPubkey: new PublicKey(""),
      lamports: 0.00001 * LAMPORTS_PER_SOL
    })
    const transaction = new Transaction().add(instruction);
    const { blockhash } = await connection.getLatestBlockhash();

    transaction.recentBlockhash = blockhash;
    transaction.feePayer = ""
    // problem is how this transaction class will be sent to backend and fronm there the transaction will be confirmed
    // via private key
    //// 1st method using serializing transfering to backend by con=verting into bunch of useLayoutEffect(() => {
    const serialize_transaction = transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false
    });

    await axios.post('/api/v1/txn/sign', {
      message: serialize_transaction,
      retry: false
    })

  }

  return (
    <div>
      <input type="text" placeholder="public Id" />
      <input type="text" placeholder="amount" />
      <button onClick={sendTransaction}>send</button>
    </div>
  )

}

export default App
