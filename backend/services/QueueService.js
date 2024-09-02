const QueueModel = require('../models/QueueModel');
const PatientModel = require('../models/PatientModel');

// Define the association
QueueModel.belongsTo(PatientModel, { foreignKey: 'PatientId' });
PatientModel.hasMany(QueueModel, { foreignKey: 'PatientId' });

// Fetch queue list by room with patient details
exports.getQueueListByRoom = async (roomId) => {
    try {
        const queueList = await QueueModel.findAll({
            where: { RoomId: roomId },
            include: [
                {
                    model: PatientModel,
                    attributes: ['UniqueNumber','FirstName','LastName','ID']
                }
            ],
            order: [['PriorityNumber', 'ASC']]
        });
        return queueList;
    } catch (error) {
        console.error('Error in getQueueByRoom:', error.message);
        return null;
    }
}

exports.findQueueByPatient =async (patientId) => {

    return (await QueueModel.findAll({
        where: { PatientId: patientId }
    }))[0];
}

exports.findQueueById = (id) => {
    return QueueModel.findByPk(id);
}

exports.findAllQueue = () => {
    return QueueModel.findAll();
}

exports.createQueue = (queueData) => {
    return QueueModel.create(queueData);
}


exports.updateQueue = (queueData) => {
    console.log(queueData);
    return QueueModel.update(queueData, {
        where: { ID: queueData.ID }

    });
}

exports.deleteQueue = (id) => {
    return QueueModel.destroy({
        where: { ID: id }
    });
}

exports.getFirstInQueueByRoom = async (roomId) => {
    try {
        const queueList = await QueueModel.findAll({
            where: { RoomId: roomId },
            include: [
                {
                    model: PatientModel,
                    attributes: ['UniqueNumber','FirstName','LastName','ID']
                }
            ],
            order: [['PriorityNumber', 'ASC']]
        });
        if (queueList && queueList.length > 0) {
            return queueList[0]; // Access the first element of the array
        } else {
            return null; // Return null if the array is empty or undefined
        }
    } catch (error) {
        console.error('Error in getFirstInQueueByRoom:', error.message);
        return null;
    }
}


exports.getSecondInQueueByRoom = async (roomId) => {
    try {
        const queueList = await QueueModel.findAll({
            where: { RoomId: roomId },
            include: [
                {
                    model: PatientModel,
                    attributes: ['UniqueNumber','FirstName','LastName','ID']
                }
            ],
            order: [['PriorityNumber', 'ASC']]
        });
        if (queueList && queueList.length > 1) {
            return queueList[1]; // Access the first element of the array
        } else {
            return null; // Return null if the array is empty or undefined
        }
    } catch (error) {
        console.error('Error in getFirstInQueueByRoom:', error.message);
        return null;
    }
}

exports.getLastInQueueByRoom = async (roomId) => {
    return await QueueModel.findOne({
        where: { RoomId: roomId },
        order: [['PriorityNumber', 'DESC']]
    });
}

exports.createAppointment = async (patientId, roomId) => {
    try {
        const lastInQueueByRoom = await this.getLastInQueueByRoom(roomId);
        const lastPriorityNumber = lastInQueueByRoom ? lastInQueueByRoom.PriorityNumber : 0;

        const data = {
            PatientId: patientId,
            RoomId: roomId,
            PriorityNumber: lastPriorityNumber + 1
        };

        const appointmentEnter = await QueueModel.create(data);
        return appointmentEnter;
    } catch (error) {
        throw new Error(error.message);
    }
}
exports.moveBetweenRooms = async (patientId, newRoomId, place) => {
    try {        
        console.log("patient id",patientId,"new roomid",newRoomId);
        let priority;
        if (place === true) {
            const lastInQueue = await this.getLastInQueueByRoom(newRoomId);
            priority = lastInQueue ? lastInQueue.PriorityNumber + 1 : 1;
        } else {
            const firstInQueue = await this.getFirstInQueueByRoom(newRoomId);
            priority = firstInQueue ? firstInQueue.PriorityNumber - 1 : 1;
        }

        const queue = await this.findQueueByPatient(patientId);
        if (!queue || queue.length === 0) {
            throw new Error('Queue not found for patient');
        }
        console.log(queue);
        const queueId = queue.ID;

        const data = {
            ID: queueId,
            PatientId: patientId,
            RoomId: newRoomId,
            PriorityNumber: priority
        };
        const appointmentUpdated = await this.updateQueue(data);
        return appointmentUpdated;
    } catch (error) {
        throw new Error(error.message);
    }
}

exports.findQueueByRoom = async (roomId) => {
    try {
        return QueueModel.findAll({
            where: { RoomId: roomId },
            order: [['PriorityNumber', 'ASC']]
        });

    } catch (error) {
        console.log(error.message);
        throw new Error(error.message);
    }
}
