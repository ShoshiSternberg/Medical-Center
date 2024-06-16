const PatientsService = require('../services/PatientsService');

exports.findPatientById = async (req, res) => {
    try {
        const patient = await PatientsService.findPatientById(req.params.id);
        if (patient) {
            return res.json({
                data: patient,
                message: 'Success.'
            });
        } else {
            return res.status(404).json({
                message: 'Patient not found.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

exports.findAllPatients = async (req, res) => {
    try {
        const patients = await PatientsService.findAllPatients();
        return res.json({
            data: patients,
            message: 'Success.'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

exports.createPatient = async (req, res) => {
    try {
        const { firstName, lastName, HMOid, phone } = req.body;
        if (!firstName || !lastName || !HMOid || !phone) {
            return res.status(400).json({
                message: 'Missing required fields'
            });
        }
        const newPatient = await PatientsService.createPatient(firstName, lastName, HMOid, phone);
        return res.status(201).json({
            data: newPatient,
            message: 'Patient created successfully.'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};


exports.updatePatient = async (req, res) => {
    try {
        const updatedPatient = await PatientsService.updatePatient(req.params.id, req.body);
        if (updatedPatient[0] === 1) { // Sequelize returns an array with the number of affected rows
            return res.json({
                message: 'Patient updated successfully.'
            });
        } else {
            return res.status(404).json({
                message: 'Patient not found.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

exports.deletePatient = async (req, res) => {
    try {
        const deleted = await PatientsService.deletePatient(req.params.id);
        if (deleted) {
            return res.json({
                message: 'Patient deleted successfully.'
            });
        } else {
            return res.status(404).json({
                message: 'Patient not found.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}