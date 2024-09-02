const express = require('express');

const router = express.Router();

const MessagesController = require('../controllers/MessagesController');

router.get('/', MessagesController.findAllMessages)
router.get('/:id', MessagesController.findMessageById)
router.post('/', MessagesController.createMessage)
router.put('/:id', MessagesController.updateMessage)
router.put('/', MessagesController.updateMessageStatus)
router.delete('/:id', MessagesController.deleteMessage)

module.exports = router;