const express = require('express');
const router = express.Router();

const RoomController = require('../controllers/RoomController');


router.get('/', RoomController.getAllRooms);
router.get('/:id', RoomController.getRoomByID);
router.post('/', RoomController.createRoom);
router.put('/:id', RoomController.updateRoom);
router.delete('/:id', RoomController.deleteRoom);

module.exports = router;