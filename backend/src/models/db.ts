import mongoose, { Schema, model } from "mongoose";
const userSchema = new Schema({
    "username": {type: String, required: true, unique: true, trim: true, lowercase: true, minLength: 5, maxLength: 30},
    "email": {type: String, required: true, unique: true, trim: true, lowercase: true},
    "password": {type: String, required: true, trim: true, minLength: 8},
    "firstName": {type: String, required: true, trim: true, lowercase: true},
    "lastName": {type: String, required: true, trim: true, lowercase: true}
})
const accountSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: "User", required: true},
    balance: {type: Number, required: true}
})
export const User = model('User', userSchema);
export const Account = model('Account', accountSchema);