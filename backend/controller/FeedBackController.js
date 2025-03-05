const FriendRequest=require("../models/friendrequest")
const User = require("../models/user");
const Feedback=require("../models/Feedback")
const userModel = require("../models/user");
const sendFriendRequest = async (req, res) => {
  const { userId, receiverId } = req.body;

  try {
    // Check if request already exists with status "pending"
    const existingRequest = await FriendRequest.findOne({ sender: userId, receiver: receiverId, status: "pending" });
    if (existingRequest) {
      return res.status(400).json({ message: "Request already sent!" });
    }

    // Check if request exists with status "rejected"
    const rejectedRequest = await FriendRequest.findOne({ sender: userId, receiver: receiverId, status: "rejected" });
    if (rejectedRequest) {
      // Update status to "pending"
      rejectedRequest.status = "pending";
      await rejectedRequest.save();
      return res.status(200).json({ message: "Friend request sent!" });
    }

    // Create a new friend request
    const newRequest = new FriendRequest({ sender: userId, receiver: receiverId, status: "pending" });
    await newRequest.save();
    res.status(201).json({ message: "Friend request sent!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error!" });
  }
};

  

  const AcceptFriendrequest= async (req, res) => {
    const { requestId, status } = req.body;
  console.log('====================================');
  console.log(requestId);
  console.log('====================================');
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status!" });
    }
  
    const request = await FriendRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found!" });
  
    request.status = status;
    await request.save();
  
    if (status === "accepted") {
      // Add users to each other's friend lists
      await User.findByIdAndUpdate(request.sender, { $push: { friends: request.receiver } });
      await User.findByIdAndUpdate(request.receiver, { $push: { friends: request.sender } });
    }
  
    res.status(200).json({ message: `Friend request ${status}!` });
  };

  const getFriendRequests = async (req, res) => {
    try {
      const { userId } = req.params;
      console.log('====================================');
      console.log(userId);
      console.log('====================================');
  
      if (!userId) {
        return res.status(400).json({ message: "User ID is required!" });
      }
  
      // Find all friend requests where the user is the receiver
      const friendRequests = await FriendRequest.find({ receiver: userId })
        .populate("sender", "full_name email image") // Populate sender details
        .exec();
  
      return res.status(200).json(friendRequests);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      return res.status(500).json({ message: "Internal server error!" });
    }
  };

  const checkFriendRequestStatus = async (req, res) => {
    try {
        const { userId, receiverId } = req.query;

        if (!userId || !receiverId) {
            return res.status(400).json({ message: "User ID and Receiver ID are required!" });
        }

        // Find the friend request
        const friendRequest = await FriendRequest.findOne({ sender: userId, receiver: receiverId });

        if (!friendRequest) {
            return res.status(200).json({ status:"pending" });
        }

        // Return the current status of the friend request
        return res.status(200).json({ status: friendRequest.status });
    } catch (error) {
        console.error("Error checking friend request status:", error);
        return res.status(500).json({ message: "Internal server error!" });
    }
};


  
  

const SendFeedBack= async (req, res) => {
    const { senderId, receiverId, comment, rating } = req.body;
  
    // Check if sender and receiver are friends
    const sender = await User.findById(senderId);
    if (!sender.friends.includes(receiverId)) {
      return res.status(403).json({ message: "You can only give feedback to friends!" });
    }
  
    const newFeedback = new Feedback({ sender: senderId, receiver: receiverId, comment, rating });
    await newFeedback.save();
    await User.findByIdAndUpdate(receiverId, {
      $push: { received_feedback: newFeedback._id },
    });
    res.status(201).json({ message: "Feedback posted!" });
  };
  

  const getFeedback = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Fetch feedback received by the user
      const feedbackList = await Feedback.find({ receiver: userId })
        .populate("sender", "full_name image") // Get sender's name & profile image
        .sort({ createdAt: -1 });
  
      res.status(200).json(feedbackList);
    } catch (error) {
      res.status(500).json({ message: "Something went wrong", error: error.message });
    }
  };
  
module.exports={sendFriendRequest, AcceptFriendrequest,getFriendRequests,checkFriendRequestStatus,SendFeedBack,getFeedback}