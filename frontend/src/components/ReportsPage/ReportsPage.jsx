import React, { useState, useEffect, useRef } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper } from '@mui/material';
import './ReportsPage.css';
import Sidebar from '../sidebar/sidebar';
import { BarChart } from '@mui/x-charts/BarChart';
import { getAllReports, getTodayReports, generateDailyReport } from '../../clientServices/ReportsService';
import GenerateReportModal from './generateNewReportModal';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import excelImg from './excelImg.png';
import { useLocation,useNavigate } from 'react-router-dom';
import Role from '../Role/role';

const ReportsPage = () => {
    const [allReports, setAllReports] = useState([]);
    const [todayReportData, setTodayReportData] = useState([]);
    const [totalPatients, setTotalPatients] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isTableVisible, setIsTableVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const tableRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();
    const role = location.state;
    const fetchAllReports = async () => {
        try {
            const response = await getAllReports();
            setAllReports(response.data);
        } catch (error) {
            console.error('Error fetching all reports:', error);
        }
    };

    const fetchTodayReports = async () => {
        try {
            const response = await getTodayReports();
            setTodayReportData(response.data);
        } catch (error) {
            console.error('Error fetching today\'s reports:', error);
        }
    };

    useEffect(() => {
        if (!sessionStorage.getItem('email')) {
            navigate('/');
        }
        else {
            fetchAllReports();
            fetchTodayReports();
        }
    }, []);

    useEffect(() => {
        const total = todayReportData.reduce((sum, report) => sum + report.amountOfPatients, 0);
        setTotalPatients(total);
    }, [todayReportData]);

    const handleGenerateReport = async (date) => {
        try {
            await generateDailyReport(date);
            setSuccessMessage(`הדוח לתאריך ${date} נוצר בהצלחה`);
            fetchAllReports();
        } catch (error) {
            console.error('Error generating report:', error);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSuccessMessage('');
    };

    const handleToggleTableView = () => {
        setIsTableVisible(!isTableVisible);
        setSelectedDate(null);
    };

    const handleSelectDate = (date) => {
        setSelectedDate(date);
    };

    useEffect(() => {
        const handlePopState = (event) => {
            if (isTableVisible) {
                setIsTableVisible(false);
                event.preventDefault(); // Prevent default back navigation
            }
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [isTableVisible]);

    const groupedReports = groupReportsByDate(allReports);

    const filteredReports = groupedReports.filter(report =>
        report.currentDate.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredReportData = selectedDate
        ? allReports.filter(report => report.currentDate === selectedDate)
        : [];

    return (
        <div className='ReportsPageContainer'>
                <Sidebar role={role}/>
                <div>
                <table ref={tableRef} style={{ display: 'none' }}>
                    <thead>
                        <tr>
                            <th>תאריך</th>
                            <th>קופת חולים</th>
                            <th>מספר מטופלים</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allReports.map((report, index) => (
                            <tr key={index}>
                                <td>{report.currentDate}</td>
                                <td>{report.HMO?.Name || 'Unknown'}</td>
                                <td>{report.amountOfPatients}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {!isTableVisible ? (
                <>
                    <div className='reportsDetailsContainer'>
                        <div className='managmentTitle'>דוחות</div>
                        <div className='contentReportCont'>
                            <div className='chartCont'>
                                <BarChart
                                    series={[
                                        { data: todayReportData.map(report => report.amountOfPatients), color: '#3766ff' }
                                    ]}
                                    height={290}
                                    width={500}
                                    xAxis={[{ data: todayReportData.map(report => report.HMO?.Name || 'Unknown'), scaleType: 'band' }]}
                                    margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                                />
                            </div>
                            <div className='chartCont'>
                                <div className='totalAmountContainer'>
                                    <div className='totalAmountTitle'>מספר מטופלים שנכנסו למוקד היום</div>
                                    <div className='totalAmount'>{totalPatients}</div>
                                </div>
                                <div className='report-btn-cont'>
                                    <button className='report-btn' onClick={() => setIsModalOpen(true)}>הפק דוח</button>
                                    <button className='report-btn' onClick={handleToggleTableView}>
                                        {isTableVisible ? 'הסתר דוחות' : 'צפייה בדוחות'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className='reportsDetailsContainer'>
                    <div className='managmentTitle'>דוחות</div>

                    <div className='reportsTableContainer' dir='rtl'>

                        <div className='tableStyleCont'>
                            <TextField
                                label="חפש לפי תאריך"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <TableContainer component={Paper} style={{ maxHeight: '300px', overflow: 'auto', width: '500px' }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>תאריך</TableCell>
                                            <TableCell>סך כל המטופלים</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredReports.map((report, index) => (
                                            <TableRow
                                                key={`${report.currentDate}-${index}`}
                                                onClick={() => handleSelectDate(report.currentDate)}
                                                sx={{
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        backgroundColor: '#f5f5f5', // Change to your desired hover color
                                                    },
                                                }}
                                            >
                                                <TableCell>{report.currentDate}</TableCell>
                                                <TableCell>{report.amountOfPatients}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                        {selectedDate && (
                            <div className='chartCont'>
                                <h3 style={{ margin: '40px' }}>נתוני דוח לתאריך {selectedDate}</h3>
                                <BarChart
                                    series={[
                                        { data: filteredReportData.map(report => report.amountOfPatients), color: '#3766ff' }
                                    ]}
                                    height={200}
                                    width={400}
                                    xAxis={[{ data: filteredReportData.map(report => report.HMO?.Name || 'Unknown'), scaleType: 'band' }]}
                                    margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                                />
                            </div>
                        )}

                    </div>

                    <DownloadTableExcel
                        filename="דוחות"
                        sheet="Reports"
                        currentTableRef={tableRef.current}
                    >
                        <button className='excel-btn' >
                            ייצא דוחות ל-Excel
                            <img src={excelImg} alt="Export to Excel" style={{ width: '20px', marginRight: '8px' }} />
                        </button>
                    </DownloadTableExcel>
                </div>
            )}

            <GenerateReportModal
                open={isModalOpen}
                handleClose={handleCloseModal}
                onSubmit={handleGenerateReport}
                successMessage={successMessage}
            />
                    <Role />

        </div>
    );
};

const groupReportsByDate = (reports) => {
    const groupedReports = reports.reduce((acc, report) => {
        const date = report.currentDate;
        if (!acc[date]) {
            acc[date] = { currentDate: date, amountOfPatients: 0 };
        }
        acc[date].amountOfPatients += report.amountOfPatients;
        return acc;
    }, {});

    return Object.values(groupedReports);
};

export default ReportsPage;
