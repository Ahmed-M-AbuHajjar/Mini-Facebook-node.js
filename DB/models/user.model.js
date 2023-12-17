import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    userName: String,
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePic: String,
    coverPic: Array,
    isConfirmed: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

export const userModel = new model('user', userSchema);
