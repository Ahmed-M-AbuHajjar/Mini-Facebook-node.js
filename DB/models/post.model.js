import { Schema, model, Types } from 'mongoose';

const postSchema = new Schema({
    content: String,
    postImage: {
        type:String,
        required:true,
    },
    createdBy: {
        type: Types.ObjectId,
        ref:'user',
        required: true,
    },
}, {
    timestamps: true
});

export const postModel = new model('post', postSchema);

