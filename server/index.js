import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import userRoutes from './routes/auth.js';

dotenv.config();
const app=express();

app.use(cors());
app.use(express.json({limit: '30mb', extended: true}));
app.use(express.urlencoded({limit: '30mb', extended: true}));

app.get('/', (req, res) =>{
    res.send("You Tube Backend is Working!");
})
app.use(bodyParser.json());

app.use('/user', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})

const DBURL = process.env.DB_URL;
mongoose.connect(DBURL).then(() =>{
    console.log("DataBase Connected!");
}).catch((err)=>{
    console.log("Error:", err.message);
})
