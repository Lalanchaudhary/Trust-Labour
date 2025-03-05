const express = require("express");
const userRouter = express.Router();
const { SignUp, getAllUser ,getProfile ,Login,UpdateRating} = require("../controller/userController");


userRouter.post("/signup", SignUp);
userRouter.post("/login", Login);
userRouter.get("/profile/:userId",getProfile);
userRouter.get("/users", getAllUser); // For getting all users
userRouter.put("/update", UpdateRating); // For getting all users

module.exports = userRouter;
