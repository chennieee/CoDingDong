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
    const { username, currentUserId } = req.query;
    console.log(`Search query received: ${username}`); //debugging

    try {
        console.log(`Searching for username: ${username}`); //debugging
        const users = await User.find({ username: new RegExp(username, 'i') }).select('username');
        console.log(`Found users: ${JSON.stringify(users)}`); //debugging

        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Add request status to users
        const usersWithStatus = await Promise.all(users.map(async user => {
            const requested = await User.exists({ _id: currentUserId, 'friendRequests.sender': user._id });
            return {
                ...user.toObject(),
                requested: !!requested
            };
        }));

        res.status(200).json(users);

    } catch (error) {
        console.error(`Error searching users: ${error.message}`); //debugging
        res.status(400).json({ error: error.message });
    }
};


// POST - Send friend request to a user
const sendFriendRequest = async (req, res) => {
    console.log('sendFriendRequest called'); //debugging
    const { userId, friendUsername } = req.body;

    try {
        // Find sender by ID
        const sender = await User.findById(userId);
        if (!sender) {
            console.log('Sender not found');
            return res.status(404).json({ error: 'Sender not found' })
        }

        // Find friend (recipient) by username
        const recipient = await User.findOne({ username: friendUsername });
        if (!recipient) {
            console.log('Recipient not found');
            return res.status(404).json({ error: 'Recipient not found' });
        }

        // Check if a friend request is already sent
        const existingRequest = recipient.friendRequests.some(
            request => request.sender.equals(sender._id)
        );
        if (existingRequest) {
            console.log('Friend request already sent');
            return res.status(400).json({ error: 'Friend request already sent' });
        }

        // Check if they are already friends
        const alreadyFriends = recipient.friends.some(friendId => friendId.equals(sender._id));
        if (alreadyFriends) {
            console.log('You are already friends');
            return res.status(400).json({ error: 'You are already friends' });
        }

        // Send friendRequest -- Update both sender and recipient friendRequests
        recipient.friendRequests.push({
            sender: sender._id,
            recipient: recipient._id
        });
        sender.friendRequests.push({
            sender: sender._id,
            recipient: recipient._id
        });

        console.log('Updating sender:', sender); // debugging
        console.log('Updating recipient:', recipient); // debugging

        await sender.save();
        await recipient.save();

        res.status(200).json({ message: 'Friend request sent' });

    } catch (error) {
        console.log('Error:', error.message);
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

        //remove the specific friend request
        user.friendRequests = user.friendRequests.filter(
            request => !(request.sender.equals(senderId) && request.recipient.equals(userId))
        );
        sender.friendRequests = sender.friendRequests.filter(
            request => !(request.sender.equals(senderId) && request.recipient.equals(userId))
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
        user.friendRequests = user.friendRequests.filter(
            request => !(request.sender.equals(senderId) && request.recipient.equals(userId))
        );
        sender.friendRequests = sender.friendRequests.filter(
            request => !(request.sender.equals(senderId) && request.recipient.equals(userId))
        );

        await user.save();
        await sender.save();

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