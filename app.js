import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
import * as  appRouter from './modules/index.routes.js'

import {connection} from './DB/connection.js';
connection();

app.use(express.json());
app.use(`${process.env.BASE_URL}uploads`, express.static('./uploads'))
app.use(`${process.env.BASE_URL}user`,appRouter.userRouter);
app.use(`${process.env.BASE_URL}auth`,appRouter.authRouter);
app.use(`${process.env.BASE_URL}post`,appRouter.postRouter);

app.get("*",(req,res)=> {
    res.send('invalid api')
})
app.listen(8080, () => {
    console.log('server is running...');
});