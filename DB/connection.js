import mongoose from 'mongoose';


export const connection = async () => {
    return await mongoose.connect(process.env.DB_CONNNECTION).then(() => {
        console.log('DB connected');
    }).catch(() => {
        console.log('error');
    })
};