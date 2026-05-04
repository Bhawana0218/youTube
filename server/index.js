import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import userRoutes from './routes/auth.js';
import videoRoutes from './routes/video.js';
import likeRoutes from './routes/like.js';

dotenv.config();
const app=express();

app.use(cors());
app.use(express.json({limit: '30mb', extended: true}));
app.use(express.urlencoded({limit: '30mb', extended: true}));

app.get('/', (req, res) =>{
    res.send("You Tube Backend is Working!");
})
app.use(bodyParser.json());

// +1
// app.use('/videos', express.static('videos'));
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.send("You Tube Backend is Working!");
});

app.use('/user', userRoutes);
app.use('/video', videoRoutes);
app.use('/like', likeRoutes);

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
