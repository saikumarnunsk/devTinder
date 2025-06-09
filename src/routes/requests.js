// routes/request.js
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const io = require('../server'); // Socket instance

router.post('/request', async (req, res) => {
  const { senderId, receiverId, actionType } = req.body;
  const actionVerb = {
    interest: 'is interested in',
    ignore: 'ignored',
    accept: 'accepted your request',
    reject: 'rejected your request',
  }[actionType];

  const message = `User ${senderId} ${actionVerb} you.`;
  const notification = new Notification({
    senderId, receiverId, type: actionType, message
  });
  await notification.save();
  
  io.to(receiverId).emit('notification', {
    _id: notification._id,
    message,
    createdAt: notification.createdAt,
  });

  res.status(201).json(notification);
});

module.exports = router;
