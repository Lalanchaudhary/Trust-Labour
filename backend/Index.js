const express = require('express');
const mongoose = require('mongoose');
const db = require('./db/db');
const dotenv = require('dotenv');
const userRouter = require('./routes/userRoute');
const feedbackrouter = require("./routes/FeedbackRoutes");
const cors = require('cors');
const http = require("http");
const body_parser = require("body-parser");
const { Server } = require("socket.io");
const User =require("./models/user")
const app = express();
dotenv.config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use('/usersroute', userRouter);
app.use('/feedback', feedbackrouter);


// Database connection
db();

// Create HTTP server
const httpServer = http.createServer(app);

// Setup Socket.IO
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join room with userId
    socket.on("join-room", (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room`);
    });

    // Handle friend request notifications
    socket.on("friend-request", (data) => {
        console.log(`Friend request sent to ${data.receiverId} from ${data.userId}`);
        io.to(data.receiverId).emit("friend-request", { senderId: data.userId, message: "New Friend Request!" });
    });

    // Handle disconnect
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

app.get("/",(req,res)=>{
    User.updateMany({}, { $set: { rating:0 } })

})

// Export io to use in routes

const PORT = process.env.PORT || 9000;
httpServer.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
});

