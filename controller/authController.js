import User from "../model/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });
};

export const register = async (req, res) => {
    const {username,email,password} = req.body;
    try{
        const userExist= await User.findOne({email});
        if (userExist){
            return res.status(400).json({message:"User already exist"});
        }
        const user =await User.create({
            username,
            email,
            password
        });
        res.cookie("token",generateToken(user._id),{
            httpOnly:true,
            secure: process.env.NODE_ENV === "production",
            sameSite:"strict",
        });
        res.status(201).json({
            _id:user._id,
            username:user.username,
            email:user.email,
            token:generateToken(user._id),
        });
        } catch (error) {
            res.status(500).json({message:"Server Error"});
        }
    };

export const login = async (req, res) => {
    const {email,password}=req.body;

    try{
        const user=await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const isMatch= await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }
        res.cookie("token",generateToken(user._id),{
            httpOnly:true,
            secure: process.env.NODE_ENV === "production",
            sameSite:"strict",
        });
        res.status(200).json({
            _id:user._id,
            username:user.username,
            email:user.email,
            token:generateToken(user._id),
        });
    }catch (error) {
        res.status(500).json({message:error.message});

    }
};

export const logoutUser = (req, res) => {
    res.cookie('token','', {
        httpOnly:true,
        expires:new Date(0),
        secure: process.env.NODE_ENV === "production",
        sameSite:"strict",
    });
    res.status(200).json({message:"Logged out successfully"});
};