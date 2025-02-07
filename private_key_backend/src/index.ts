import { express } from "express";
// add node polyfills its frontend (solana/web3.js not work);
// 
import { Keypair, Transaction } from "@solana/web3.js";
import connectDB from "./db";
import userModal from "./model";
import cors from "cors";
import { connection } from "mongoose";

const app = new express();
app.use(express.json());
app.use(cors());

connectDB();


app.post('/signup', async (req, res) => {
  const email = req.email;
  const password = req.password;

  // genearate keypair and store private key and send public key to user
  const keyPair = new Keypair();

  await userModal.create({
    email,
    password,
    KeyPair.publicKey,
    KeyPair.privateKey
  })

  res.json({
    message: "signup Succesfull"
  })
})

app.post('/signin', async (req, res) => {

  const email = req.email;
  const password = req.password;

  const user = await userModal.findOne({
    email,
    password
  })
  if (user) {

    const token = jwt.sign()
    res.json({

    })
  }

})
// authenticate user and return jwt and also public key

app.post('/api/v1/txn/send', (req, res) => {
  const serial_transaction = req.body();

  const transaction = Transaction.from(serial_transaction);
  const signtransaction = transaction.sign(user.privateKey);
  await connection.send(signtransaction);


  res.json({
    message: "transaction is send"
  })

})
app.post('/transaction_status', (req, res) => {

  res.json({
    message: "Transaction status endpoint"
  })
})

app.listen(3000);
