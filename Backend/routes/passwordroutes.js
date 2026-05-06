import express from "express";
import { forgotPassword, resetPassword, changePassword } from "../controllers/passwordcontroller.js";
import { verifyToken } from "../middleware/auth.js";

const passwordRouter = express.Router();

passwordRouter.post("/forgot", forgotPassword);
passwordRouter.post("/reset", resetPassword);
passwordRouter.post("/change", verifyToken, changePassword);

export default passwordRouter;
