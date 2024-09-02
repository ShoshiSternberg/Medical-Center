const HMOsService = require('../services/HMOsService');

exports.findHMOById = async (req, res) => {
    try {
        const HMO = await HMOsService.findHMOById(req.params.id);
        if (HMO) {
            return res.json({
                data: HMO,
                message: 'Success.'
            });
        } else {
            return res.status(404).json({
                message: 'HMO not found.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

exports.findAllHMOs = async (req, res) => {
    try {
        const HMOs = await HMOsService.findAllHMOs();
        return res.json({
            data: HMOs,
            message: 'Success.'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

exports.createHMO = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({
                message: 'Missing required fields'
            });
        }
        const newHMO = await HMOsService.createHMO(name);
        return res.status(201).json({
            data: newHMO,
            message: 'HMO created successfully.'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

exports.updateHMO = async (req, res) => {
    try {
        const updatedHMO = await HMOsService.updateHMO(req.params.id, req.body);
        if (updatedHMO[0] === 1) { // Sequelize returns an array with the number of affected rows
            return res.json({
                message: 'HMO updated successfully.'
            });
        } else {
            return res.status(404).json({
                message: 'HMO not found.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

exports.deleteHMO = async (req, res) => {
    try {
        const deleted = await HMOsService.deleteHMO(req.params.id);
        if (deleted) {
            return res.json({
                message: 'HMO deleted successfully.'
            });
        } else {
            return res.status(404).json({
                message: 'HMO not found.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}
