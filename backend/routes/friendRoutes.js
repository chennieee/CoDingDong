const express = require('express');

const {
    getUserFriends,
    searchUsers,
    sendFriendRequest,
    acceptFriendRequest,
    deleteFriendRequest,
    removeFriend
} = require('../controllers/friendController');

const router = express.Router();

// GET a user by searching their username
router.get('/search', searchUsers);

// GET user friends and friend requests
router.get('/:id', getUserFriends)

// POST - Send friend request to a user
router.post('/sendRequest', sendFriendRequest);

// POST - Accept friend request
router.post('/acceptRequest', acceptFriendRequest);

// DELETE - Delete friend request
router.delete('/deleteRequest', deleteFriendRequest);

// DELETE - Remove friend
router.delete('/removeFriend', removeFriend);

// Export router
module.exports = router;