const User = require('../models/User');
const mongoose = require('mongoose');


// GET user friends and friendRequests
const getUserFriends = async (req, res) => {
    const { id } = req.params; //userId

    //check if id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'User not found'});
    }

    try {
        console.log('Fetching friends and friend requests for user ID:', id); //debugging

        //find user
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        //fetch friends data
        const friends = await User.find({ _id: { $in: user.friends } }).select('username xp streak');
        console.log('User friends found:', friends); //debugging

        //fetch friend requests data
        const friendRequests = await Promise.all(user.friendRequests.map(async (request) => {
            const sender = await User.findById(request.sender).select('username');
            return { sender };
        }));

        //send response
        res.status(200).json({ friends, friendRequests });

    } catch (error) {
        console.error('Error fetching friends and friend requests:', error);
        res.status(400).json({ error: error.message });
    }
};


// GET a user by searching their username
const searchUsers = async (req, res) => {
    const { username } = req.query;
    console.log(`Search query received: ${username}`); //debugging

    try {
        console.log(`Searching for username: ${username}`); //debugging
        const users = await User.find({ username: new RegExp(username, 'i') }).select('username');
        console.log(`Found users: ${JSON.stringify(users)}`); //debugging
        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(users);

    } catch (error) {
        console.error(`Error searching users: ${error.message}`); //debugging
        res.status(400).json({ error: error.message });
    }
};


// POST - Send friend request to a user
const sendFriendRequest = async (req, res) => {
    const { userId, friendUsername } = req.body;

    try {
        // Find friend by username
        const friend = await User.findOne({ username: friendUsername });
        if (!friend) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Send friendRequest to the found user
        await User.findByIdAndUpdate(friend._id, {
            $push: { friendRequests: { sender: userId } }
        });
        res.status(200).json({ message: 'Friend request sent' });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// POST - Accept friend request
const acceptFriendRequest = async (req, res) => {
    const { userId, senderId } = req.body;

    //check if userId is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(404).json({ error: 'Invalid user ID' });
    }
    //check if senderId is valid
    if (!mongoose.Types.ObjectId.isValid(senderId)) {
        return res.status(404).json({ error: 'Invalid sender ID' });
    }

    try {
        //find user and sender
        const user = await User.findById(userId);
        const sender = await User.findById(senderId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (!sender) {
            return res.status(404).json({ error: 'Sender not found' });
        }

        //add each other to each other's friend list
        user.friends.push(senderId);
        sender.friends.push(userId);

        //remove friend request
        user.friendRequests = user.friendRequests.filter(
            request => !request.sender.equals(senderId)
        );

        await user.save();
        await sender.save();
        
        //send response
        res.status(200).json({ message: 'Friend request accepted' });  
    
    } catch (error) {
        console.error('Error accepting friend request:', error)
        res.status(400).json({ error: error.message });
    }
};


// DELETE - Delete friend request
const deleteFriendRequest = async (req, res) => {
    const { userId, senderId } = req.body;

    //check if userId is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(404).json({ error: 'Invalid user ID' });
    }
    //check if senderId is valid
    if (!mongoose.Types.ObjectId.isValid(senderId)) {
        return res.status(404).json({ error: 'Invalid sender ID' });
    }

    try {
        //find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        //delete friendRequest
        user.friendRequests = user.friendRequests.filter(request => !request.sender.equals(senderId));
        await user.save();

        //send response
        res.status(200).json({ message: 'Friend request deleted' });
    
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// DELETE - Remove friend
const removeFriend = async (req, res) => {
    const { userId, friendId } = req.body;

    //check if userId is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(404).json({ error: 'Invalid user ID' });
    }
    //check if friendId is valid
    if (!mongoose.Types.ObjectId.isValid(friendId)) {
        return res.status(404).json({ error: 'Invalid friend ID' });
    }
    
    try {
        //find user and friend
        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (!friend) {
            return res.status(404).json({ error: 'Friend not found' });
        }

        //Remove each other from each other's friend list
        user.friends = user.friends.filter(friend => !friend.equals(friendId));
        friend.friends = friend.friends.filter(friend => !friend.equals(userId));

        await user.save();
        await friend.save();

        //send response
        res.status(200).json({ message: 'Friend removed' });
    
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    getUserFriends,
    searchUsers,
    sendFriendRequest,
    acceptFriendRequest,
    deleteFriendRequest,
    removeFriend
};