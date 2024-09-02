const QueueService = require('../services/QueueService');

exports.findQueueById = async (req, res) => {
    try {
        const queue = await QueueService.findQueueById(req.params.id);
        if (queue) {
            return res.json({
                data: queue,
                message: 'Success.'
            });
        } else {
            return res.status(404).json({
                message: 'Queue not found.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

exports.getQueueListByRoom = async (req, res) => {
    try {
        const roomId = req.params.id;
        const queueList = await QueueService.getQueueListByRoom(roomId);
        res.json(queueList);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }

};

exports.getFirstInRoom = async (req, res) => {
    try {
        const roomId = req.params.id;
        console.log(roomId)
        const queueList = await QueueService.getFirstInQueueByRoom(roomId);
        console.log('Queue list:', queueList); // Add logging here
        res.json(queueList);
    } catch (error) {
        console.error('Error in controller:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};


exports.findAllQueues = async (req, res) => {
    try {
        const queues = await QueueService.findAllQueue();
        return res.json({
            data: queues,
            message: 'Success.'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

exports.createQueue = async (req, res) => {
    try {
        const newQueue = await QueueService.createQueue(req.body);
        return res.status(201).json({
            data: newQueue,
            message: 'Queue created successfully.'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

exports.updateQueue = async (req, res) => {
    try {
        const updatedQueue = await QueueService.updateQueue(req.params.id, req.body);
        if (updatedQueue[0] === 1) { // Sequelize returns an array with the number of affected rows
            return res.json({
                message: 'Queue updated successfully.'
            });
        } else {
            return res.status(404).json({
                message: 'Queue not found.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

exports.deleteQueue = async (req, res) => {
    try {
        const deleted = await QueueService.deleteQueue(req.params.id);
        if (deleted) {
            return res.json({
                message: 'Queue deleted successfully.'
            });
        } else {
            return res.status(404).json({
                message: 'Queue not found.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

exports.findQueueByPatient = async (req, res) => {
    try {
        const queues = await QueueService.findQueueByPatient(req.params.patientId);
        return res.json({
            data: queues,
            message: 'Success.'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

exports.getFirstInQueueByRoom = async (req, res) => {
    try {
        const queue = await QueueService.getFirstInQueueByRoom(req.params.roomId);
        return res.json({
            data: queue,
            message: 'Success.'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

exports.getLastInQueueByRoom = async (req, res) => {
    try {
        const queue = await QueueService.getLastInQueueByRoom(req.params.roomId);
        return res.json({
            data: queue,
            message: 'Success.'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

exports.createAppointment = async (req, res) => {
    try {
        const { patientId, roomId } = req.body;
        const appointment = await QueueService.createAppointment(patientId, roomId);
        return res.status(201).json({
            data: appointment,
            message: 'Appointment created successfully.'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

exports.moveBetweenRooms = async (req, res) => {
    try {
        const { patientId, newRoomId, place } = req.body;
        const updatedQueue = await QueueService.moveBetweenRooms(patientId, newRoomId, place);
        return res.json({
            data: updatedQueue,
            message: 'Patient moved between rooms successfully.'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}
