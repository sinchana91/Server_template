import express from 'express';
import { register,login,logoutUser } from '../controller/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post("/register",register);
router.post("/login",login);
router.get("/logout",logoutUser);

router.get("/profile",protect,(req,res)=>{
    res.json(req.user);
});

export default router;