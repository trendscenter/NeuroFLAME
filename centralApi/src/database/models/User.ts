import mongoose, { Schema, Document, Model } from 'mongoose';

// Define an interface for the User document
interface IUser extends Document {
    username: string;
    hash: string;  // Typically used to store the hashed password
}

// Create the schema
const userSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    hash: { type: String, required: true }  // Storing password hashes, not plain passwords
});

// Create the model
const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
