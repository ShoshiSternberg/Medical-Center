const RoomsModel = require('../models/RoomModel');

exports.findRoomById = (id) => {
    return RoomsModel.findByPk(id);
}

exports.findRoomByName = async (name) => {
    try {
        const room = await RoomsModel.findOne({
            where: { Name: name }  // Ensure the column name matches your database schema
        });
        if (!room) {
            throw new Error('Room not found');
        }
        console.log(`Room found: ${JSON.stringify(room)}`);
        return room.ID;
    } catch (error) {
        console.error(`Error finding room by name: ${error.message}`);
        throw error;
    }
};



exports.findAllRooms = () => {
    return RoomsModel.findAll();
}

exports.createRoom = async (roomData) => {
    try {        
        const newRoom = await RoomsModel.create(roomData);
        console.log(newRoom);
        return newRoom;
    } catch (error) {
        console.log(error.message);
        throw new Error(error.message);
    }
}

exports.updateRoom = (id, roomData) => {
    return RoomsModel.update(roomData, {
        where: { ID: id }
    });
}

exports.deleteRoom = (id) => {
    
    return RoomsModel.destroy({
        where: { ID: id }
    });
}
