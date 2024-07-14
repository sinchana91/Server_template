import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';


dotenv.config();

connectDB();

const app = express();

// app.use(cors({
//     origin:"http://frontent-url.com",
//     credentials:true,
// }));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',authRoutes);

app.get('/', (req, res) => {
    res.send('API is running....');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
