const express = require("express");
const feedbackrouter = express.Router();
const { sendFriendRequest, AcceptFriendrequest,getFriendRequests,checkFriendRequestStatus, SendFeedBack, getFeedback } = require("../controller/FeedBackController");

// Friend Request Routes
feedbackrouter.post("/send-request", sendFriendRequest);
feedbackrouter.post("/accept-request", AcceptFriendrequest);
feedbackrouter.get("/get-request/:userId", getFriendRequests);
feedbackrouter.get('/request-status', checkFriendRequestStatus);
// Feedback Routes
feedbackrouter.post("/send-feedback", SendFeedBack);
feedbackrouter.get("/get-feedback/:userId", getFeedback);

module.exports = feedbackrouter;
