import express from "express";
import multer from "multer";

import postController from "../controllers/post-contoller.js";
const { 
    createNewPost,
    updatePost,
    getAllPosts,
    getPostById,
    deletePost,
} = postController;

const uploadMiddleware = multer({ dest: './uploads/' });
const router = express.Router();

router.post('/post', uploadMiddleware.single('file'), createNewPost);

router.put('/post', uploadMiddleware.single('file'), updatePost);

router.get('/post', getAllPosts);

router.get('/post/:id', getPostById);

router.delete('/post/:id', deletePost);

export default router;