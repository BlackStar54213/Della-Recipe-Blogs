import { mongoose } from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    email: String,
    hashed_password: String,
    salt: String
});

export const User = mongoose.model('user', userSchema);
