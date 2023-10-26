import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

// routes
import userRoutes from "./routes/user-routes.js";
import postRoutes from "./routes/post-routes.js";

const app = express();
const __dirname = path.resolve();

app.use(cors({
    credentials: true, 
    origin:'http://localhost:5173',
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname + '/uploads')));

mongoose
    .connect('mongodb+srv://admin:pass123@cluster0.khdejq9.mongodb.net/')
    .then(() => console.log('DB connected'))
    .catch((err) => console.log('DB error', err));

app.use(userRoutes);
app.use(postRoutes);

app.listen(4000, 'localhost', () => {
    console.log('Server started at: http://localhost:4000');
});
