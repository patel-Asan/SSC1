import express from "express";
import { submitMessage, getMessages, markAsRead, deleteMessage, getMessageStats } from "../controllers/messagecontroller.js";

const messageRouter = express.Router();

messageRouter.post("/submit", submitMessage);
messageRouter.get("/all", getMessages);
messageRouter.get("/stats", getMessageStats);
messageRouter.put("/read/:id", markAsRead);
messageRouter.delete("/:id", deleteMessage);

export default messageRouter;
