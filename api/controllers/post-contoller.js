import Post from "../models/Post.js";
import jwt from "jsonwebtoken";
import fs from "fs";

const secret = 'dasd1rgf8ew7fuiwh12hr0ieh';

const createNewPost =  async (req, res) => {
    if(!req.file) {
        return res.status(400).json('No file uploaded');
        alert('add image');
    }
    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path+'.'+ext;
    fs.renameSync(path, newPath);

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if(err) throw err;
        const {title, summary, content} = req.body;
        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover: newPath,
            author: info.id,
        });
        res.json(postDoc);
    });
}

const updatePost = async (req, res) => {
    let newPath = null;
    if(req.file) {
        const {originalname, path} = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path+'.'+ext;
        fs.renameSync(path, newPath);
    }

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if(err) throw err;
        const {id, title, summary, content} = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);

        if(!isAuthor) {
            return res.status(400).json('you are no the author');
        }

        await postDoc.updateOne({
            title, 
            summary, 
            content,
            cover: newPath ? newPath : postDoc.cover,
        });
        res.json(postDoc);
    });
}

const getAllPosts = async (req, res) => {
    res.json(
        await Post.find()
            .populate('author', ['username'])
            .sort({createdAt: -1})
            .limit(20)
    );
}

const getPostById = async (req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
}

const deletePost = async (req, res) => {
    const { id } = req.params;
    const { token } = req.cookies;

    if(!token) {
        return res.status(401).json('Authentication required');
    }

    try {
        const decoded = jwt.verify(token, secret);
        const postDoc = await Post.findById(id);

        if (!postDoc) {
            return res.status(404).json('Post not found');
        }

        if(postDoc.author.toString() !== decoded.id) {
            return res.status(403).json('You are not the author');
        }

        await Post.deleteOne({ _id: postDoc._id });

        res.json('Post deleted');
    } catch(err) {
        console.error('Server error:', err);
        res.status(500).json('Server error');
    }
}

export default {
    createNewPost,
    updatePost,
    getAllPosts,
    getPostById,
    deletePost,
}