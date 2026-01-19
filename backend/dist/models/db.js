import mongoose, { Schema } from "mongoose";
import { lowercase } from "zod";
const userSchema = new Schema({
    "username": { type: String, required: true, unique: true, trim: true, lowercase: true, minLength: 5, maxLength: 30 },
    "email": { type: String, required: true, unique: true, trim: true, lowercase: true },
    "password": { type: String, required: true, trim: true, minLength: 8 },
    "firstName": { type: String, required: true, trim: true, lowercase: true },
    "lastName": { type: String, required: true, trim: true, lowercase: true }
});
export const User = mongoose.model('User', userSchema);
//# sourceMappingURL=db.js.map