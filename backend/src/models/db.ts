import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
    "username": {type: String, required: true, unique: true, trim: true, lowercase: true, minLength: 5, maxLength: 30},
    "email": {type: String, required: true, unique: true, trim: true, lowercase: true},
    "password": {type: String, required: true, trim: true, minLength: 8},
    "firstName": {type: String, required: true, trim: true},
    "lastName": {type: String, required: true, trim: true}
})

export const User = mongoose.model('User', userSchema);