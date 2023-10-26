import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt  from "jsonwebtoken";

const salt = bcrypt.genSaltSync(10);
const secret = 'dasd1rgf8ew7fuiwh12hr0ieh';

const register = async (req, res) => {
    const {username, password} = req.body;
    try {
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt),
        });
    res.json(userDoc);
    } catch(err) {
        console.log(err);
        res.status(400).json(err);
    }
}

const login = async (req, res) => {
    const {username, password} = req.body;
    const userDoc = await User.findOne({username});

    if(!userDoc) {
        return res.status(400).json('User not found');
    }

    const passOk = bcrypt.compareSync(password , userDoc.password);
    if(passOk) {
        jwt.sign({username, id: userDoc._id}, secret, {}, (err, token) => {
            if(err) throw err;
            res.cookie('token', token).json({
                id: userDoc._id,
                username,
            });
        });
    } else {
        res.status(400).json('Wrong credentials');
    }
}

const getProfile = (req, res) => {
    const {token} = req.cookies;

    if(!token) {
        res.status(401).json('Authentication required');
    } else {
        jwt.verify(token, secret, {}, (err, info) => {
            if(err) throw err;
            res.json(info);
        });
    }
}

const logout = (req, res) => {
    res.cookie('token', '').json('ok');
}

export default {
    register,
    login,
    getProfile,
    logout,
}