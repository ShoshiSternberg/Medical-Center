const PatientModel = require('../models/PatientModel');
const ReportModel = require('../models/ReportsModel');
const HMOModel = require('../models/HMOModel');
const db = require('../database/db'); // Adjust the path as necessary
ReportModel.belongsTo(HMOModel, { foreignKey: 'hmoID'});

exports.generateDailyReport = async (date) => {
    try {
        // Parse the input date string
        const [year, month, day] = date.split('-').map(Number);
        if (isNaN(year) || isNaN(month) || isNaN(day)) {
            throw new Error('Invalid date format');
        }

        // Create date objects for the start and end of the day
        const startDate = new Date(year, month - 1, day);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(year, month - 1, day);
        endDate.setHours(23, 59, 59, 999);

        // Find all patients who checked in on the given date
        const patients = await PatientModel.findAll({
            where: {
                CheckIn: {
                    [db.Sequelize.Op.between]: [startDate, endDate]
                }
            },
            include: {
                model: HMOModel,
                attributes: ['ID', 'Name']
            }
        });

        // Count the number of patients per HMO
        const hmoPatientCount = {};
        patients.forEach(patient => {
            const hmoID = patient.HMOid;
            if (hmoPatientCount[hmoID]) {
                hmoPatientCount[hmoID].count += 1;
            } else {
                hmoPatientCount[hmoID] = {
                    name: patient.HMO.Name,
                    count: 1
                };
            }
        });

        // Fetch all HMOs to ensure all HMOs are included in the report
        const allHMOs = await HMOModel.findAll();
        allHMOs.forEach(hmo => {
            if (!hmoPatientCount[hmo.ID]) {
                hmoPatientCount[hmo.ID] = {
                    name: hmo.Name,
                    count: 0
                };
            }
        });

        // Generate or update reports for all HMOs
        const reportPromises = Object.keys(hmoPatientCount).map(async hmoID => {
            const existingReport = await ReportModel.findOne({
                where: {
                    hmoID: parseInt(hmoID),
                    currentDate: date // Compare using string date
                }
            });

            if (existingReport) {
                // Update the existing report
                return ReportModel.update({
                    amountOfPatients: hmoPatientCount[hmoID].count
                }, {
                    where: {
                        ID: existingReport.ID
                    }
                });
            } else {
                // Create a new report
                return ReportModel.create({
                    hmoID: parseInt(hmoID),
                    currentDate: date,
                    amountOfPatients: hmoPatientCount[hmoID].count
                });
            }
        });

        await Promise.all(reportPromises);

        return { message: 'Reports generated and updated successfully.' };
    } catch (error) {
        throw new Error(`Error generating report: ${error.message}`);
    }
};



exports.getTodayReports = async () => {
    try {
        // Get today's date in "year-month-day" format
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const todayDateString = `${year}-${month}-${day}`;

        // Generate today's report
        console.log(todayDateString)
        await exports.generateDailyReport(todayDateString);

        // Fetch all reports with today's date
        const todayReports = await ReportModel.findAll({
            where: {
                currentDate: todayDateString
            },
            include: [{
                model: HMOModel,
                attributes: ['Name'] // Include HMO name
            }]
        });
        return todayReports;
    } catch (error) {
        throw new Error(`Error fetching today's reports: ${error.message}`);
    }
};
exports.findReportById = (id) => {
    return ReportModel.findByPk(id);
};

exports.findReportByDate = (date) => {
    return ReportModel.findAll(date,{
        where: { currentDate: date }
    });
};



exports.findAllReports = () => {
    return ReportModel.findAll({
        include: {
            model: HMOModel,
            attributes: ['ID', 'Name']
        }});
};

exports.updateReport = (id, reportData) => {
    return ReportModel.update(reportData, {
        where: { ID: id }
    });
};

exports.deleteReport = (id) => {
    return ReportModel.destroy({
        where: { ID: id }
    });
};

exports.createReport = async (hmoID, date, amountOfPatients = 0) => {
    try {
        const data = {
            hmoID,
            date,
            amountOfPatients
        };

        const report = await ReportModel.create(data);
        return report;
    } catch (error) {
        throw new Error(error.message);
    }
};
