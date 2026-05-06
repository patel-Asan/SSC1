import messageModel from "../models/messagemodel.js";

const submitMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ 
                success: false, 
                message: "All fields are required" 
            });
        }

        const newMessage = new messageModel({
            name,
            email,
            message
        });

        await newMessage.save();

        res.status(201).json({ 
            success: true, 
            message: "Message sent successfully" 
        });
    } catch (error) {
        console.error("Submit message error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

const getMessages = async (req, res) => {
    try {
        const messages = await messageModel.find().sort({ createdAt: -1 });
        res.status(200).json({ 
            success: true, 
            messages 
        });
    } catch (error) {
        console.error("Get messages error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        
        const message = await messageModel.findByIdAndUpdate(
            id,
            { status: 'read' },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({ 
                success: false, 
                message: "Message not found" 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: "Message marked as read",
            data: message
        });
    } catch (error) {
        console.error("Mark as read error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        
        const message = await messageModel.findByIdAndDelete(id);

        if (!message) {
            return res.status(404).json({ 
                success: false, 
                message: "Message not found" 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: "Message deleted successfully" 
        });
    } catch (error) {
        console.error("Delete message error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

const getMessageStats = async (req, res) => {
    try {
        const total = await messageModel.countDocuments();
        const unread = await messageModel.countDocuments({ status: 'unread' });
        const read = await messageModel.countDocuments({ status: 'read' });
        const replied = await messageModel.countDocuments({ status: 'replied' });

        res.status(200).json({ 
            success: true, 
            stats: { total, unread, read, replied }
        });
    } catch (error) {
        console.error("Get message stats error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

export { submitMessage, getMessages, markAsRead, deleteMessage, getMessageStats };
