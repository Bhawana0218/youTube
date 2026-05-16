import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import userRoutes from './routes/auth.js';
import videoRoutes from './routes/video.js';
import likeRoutes from './routes/like.js';
import watchlaterRoutes from './routes/WatchLater.js';
import historyRoutes from './routes/history.js';
import commentRoutes from './routes/comment.js';
import downloadRoutes from './routes/download.js';
import premiumRoutes from './routes/premium.js';

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

app.use((req, res, next) => {
    if (req.path === "/") return next();

    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            message: "Database is not connected yet. Please retry in a moment."
        });
    }
    next();
});

app.use('/user', userRoutes);
app.use('/video', videoRoutes);
app.use('/like', likeRoutes);
app.use('/watchlater', watchlaterRoutes);
app.use('/history', historyRoutes);
app.use('/comment', commentRoutes);
app.use('/download', downloadRoutes);
app.use('/premium', premiumRoutes);

const PORT = process.env.PORT || 5000;

const DBURL = process.env.DB_URL;

if (!DBURL) {
    console.error("Error: DB_URL is missing in server/.env");
    process.exit(1);
}

mongoose.connection.on("error", (err) => {
    console.log("MongoDB connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected.");
});

const startServer = async () => {
    try {
        await mongoose.connect(DBURL, {
            serverSelectionTimeoutMS: 8000,
            socketTimeoutMS: 45000,
        });

        console.log("DataBase Connected!");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error("MongoDB startup connection failed:", err.message);
        process.exit(1);
    }
};

startServer();
