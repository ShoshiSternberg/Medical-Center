const RoomsService = require('../services/RoomService');

exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await RoomsService.findAllRooms();
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getRoomByID = async (req, res) => {
    try {
        const room = await RoomsService.findRoomById(req.params.id);
        if (room) {
            res.json(room);
        } else {
            res.status(404).json({ message: 'Room not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.createRoom = async (req, res) => {
    try {
        
        const newRoom = await RoomsService.createRoom(req.body);
        
        res.status(201).json({
            message: "Room created successfully!",
            data: newRoom
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateRoom = async (req, res) => {
    try {
        const [updated] = await RoomsService.updateRoom(req.params.id, req.body);
        if (updated) {
            res.json({ message: "Room updated successfully!" });
        } else {
            res.status(404).json({ message: 'Room not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteRoom = async (req, res) => {
    try {
        const deleted = await RoomsService.deleteRoom(req.params.id);
        if (deleted) {
            res.json({ message: "Room deleted successfully" });
        } else {
            res.status(404).json({ message: 'Room not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
