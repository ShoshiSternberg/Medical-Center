const ReportsService = require('../services/ReportService');

exports.findReportById = async (req, res) => {
    try {
        const report = await ReportsService.findReportById(req.params.id);
        if (report) {
            return res.json({
                data: report,
                message: 'Success.'
            });
        } else {
            return res.status(404).json({
                message: 'Report not founvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvd.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

exports.findAllReports = async (req, res) => {
    try {
        const reports = await ReportsService.findAllReports();
        return res.json({
            data: reports,
            message: 'Success.'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

exports.createReport = async (req, res) => {
    try {
        const { hmoID, date, amountOfPatients } = req.body;
        if (!hmoID) {
            return res.status(400).json({
                message: 'Missing required fields'
            });
        }
        const newReport = await ReportsService.createReport(hmoID, date, amountOfPatients);
        return res.status(201).json({
            data: newReport,
            message: 'Report created successfully.'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

exports.updateReport = async (req, res) => {
    try {
        const updatedReport = await ReportsService.updateReport(req.params.id, req.body);
        if (updatedReport[0] === 1) { // Sequelize returns an array with the number of affected rows
            return res.json({
                message: 'Report updated successfully.'
            });
        } else {
            return res.status(404).json({
                message: 'Report not found vvvvvvvvvvvvvvvvvvvvvvvvvvv.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

exports.deleteReport = async (req, res) => {
    try {
        const deleted = await ReportsService.deleteReport(req.params.id);
        if (deleted) {
            return res.json({
                message: 'Report deleted successfully.'
            });
        } else {
            return res.status(404).json({
                message: 'Report not found vfvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};



exports.generateDailyReport = async (req, res) => {
    try {
        const { date } = req.body;
        if (!date) {
            return res.status(400).json({
                message: 'Date is required.'
            });
        }

        const result = await ReportsService.generateDailyReport(date);
        return res.status(200).json({
            message: result.message
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};



exports.getTodayReports = async (req, res) => {
    try {
        console.log('ffffffffffff')
        const todayReports = await ReportsService.getTodayReports();
        console.log('ffffffffffff')
        return res.status(200).json({
            message: 'Today\'s reports fetched successfully.',
            data: todayReports
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};