import express from "express";

import userRoutes from "../controllers/user-controller.js";
const {
    register,
    login,
    getProfile,
    logout,
} = userRoutes;

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.get('/profile', getProfile);

router.post('/logout', logout);

export default router;