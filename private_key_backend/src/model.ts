import mongoose, { Schema } from "mongoose";




const userSchema = mongoose.Schema({
  username: string,
  email: string,
  password: string,
  publicKey: string,
  privateKey: string
})

const userModal = mongoose.Model("user", userSchema);

export default userModal;
