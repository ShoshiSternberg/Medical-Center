const PatientsService = require('../services/PatientsService');

exports.getPatientById = async (req, res) => {
    const { id } = req.params;
    console.log('Patient ID:', id);  // Log the ID to verify
    try {
        const patient = await PatientsService.findPatientById(id);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found." });
        }
        return res.status(200).json(patient);
    } catch (error) {
        console.error('Error fetching patient:', error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

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

exports.getAllPatientsWithQueueDetails = async (req, res) => {
    try {
        const patients = await PatientsService.getAllPatientsWithQueueDetails();
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
        console.log( firstName, lastName, HMOid, phone)
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

exports.addManualPatient = async (req, res) => {
    try {
        const { firstName, lastName, HMOid, phone , Tz , roomId } = req.body;
        if (!firstName || !lastName || !HMOid || !phone ||!Tz ||!roomId) {
            return res.status(400).json({
                message: 'Missing required fields'
            });
        }
        const newPatient = await PatientsService.addManualPatient(firstName, lastName, HMOid, phone , Tz , roomId);
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
