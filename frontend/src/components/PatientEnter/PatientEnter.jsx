import React, { useState, useEffect } from 'react';
import './PatientEnter.css';
import useSocket from "../../clientServices/PatientSocket.js";
import { getAllHMOs } from "../../clientServices/HmosService.js";
import doctorImg from '../../doctor.png';

const PatientEnter = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [identityNumber, setIdentityNumber] = useState('');
    const [phone, setPhone] = useState('');
    const [patientClinic, setPatientClinic] = useState('');
    const [newPatient, setNewPatient] = useState({});
    const [currentStep, setCurrentStep] = useState(1);
    const [currentTime, setCurrentTime] = useState('');
    const [clinicsList, setClinicsList] = useState([]);
    const [patientDetails, setPatientDetails] = useState({});
    const { insertPatient } = useSocket(setPatientDetails);

    const numberCharacters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    // Function to validate the ID
    const IDValidator = (id) => {
        if (id.length !== 9 || isNaN(id)) return false;
        let sum = 0;
        for (let i = 0; i < id.length; i++) {
            let num = Number(id[i]) * ((i % 2) + 1);
            sum += num > 9 ? num - 9 : num;
        }
        return sum % 10 === 0;
    };

    // Fetch clinics data
    useEffect(() => {
        const fetchClinics = async () => {
            try {
                const response = await getAllHMOs();
                setClinicsList(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchClinics();
    }, []);

    const handleKeyPress = (key, setState) => {
        setState((prev) => key === 'x' ? prev.slice(0, -1) : prev + key);
    };

    // Handling the step-by-step form submissions
    const handleSubmitStep1 = () => {
        if (identityNumber.trim() === '') {
            alert('הכנס בבקשה תעודת זהות');
            return;
        }
        if (!IDValidator(identityNumber)) {
            alert('תעודת זהות לא תקינה');
            return;
        }
        setCurrentStep(2);
    };

    const handleSubmitStep2 = () => {
        if (phone.trim() === '') {
            alert('הכנס מספר טלפון');
            return;
        }
        setCurrentStep(3);
    };

    const handleClinicSelection = (selectedClinic) => {
        setPatientClinic(selectedClinic);
    };

    const handleClinicSubmit = () => {
        if (patientClinic === '') {
            alert('בחר קופת חולים');
            return;
        }

        insertPatient(firstName, lastName, patientClinic, phone, identityNumber);
        console.log('Identity Number:', identityNumber);
        setCurrentStep(4);

        // Set the current time
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        setCurrentTime(currentTime);

        // Reset state after 15 seconds
        setTimeout(() => {
            setFirstName('');
            setLastName('');
            setIdentityNumber('');
            setPhone('');
            setPatientClinic('');
            setNewPatient({});
            setCurrentStep(1);
        }, 15000);
    };

    return (
        <div className='patientEnterCont'>
            <img src={doctorImg} alt='doctor' className='doctorImg' />
            <div className='enterBoardCont'>
                {currentStep === 1 && (
                    <div className='insertIdentityNumber'>
                        <input
                            placeholder="הכנס מספר זהות מטופל"
                            type="text"
                            value={identityNumber}
                            onChange={(e) => setIdentityNumber(e.target.value)}
                            className='inputNameBtn'
                        />
                        <div className='virtualKeyboard'>
                            {numberCharacters.map((key) => (
                                <button
                                    key={key}
                                    className='keyboard'
                                    onClick={() => handleKeyPress(key, setIdentityNumber)}
                                >
                                    {key}
                                </button>
                            ))}
                            <button
                                className='keyboard deletePrevBtn'
                                onClick={() => handleKeyPress('x', setIdentityNumber)}
                            >
                                מחק
                            </button>
                        </div>
                        <button className='continueBtn' onClick={handleSubmitStep1}>
                            המשך
                        </button>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className='insertIdentityNumber'>
                        <input
                            placeholder="הכנס מספר טלפון"
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className='inputNameBtn'
                        />
                        <div className='virtualKeyboard'>
                            {numberCharacters.map((key) => (
                                <button
                                    key={key}
                                    className='keyboard'
                                    onClick={() => handleKeyPress(key, setPhone)}
                                >
                                    {key}
                                </button>
                            ))}
                            <button
                                className='keyboard deletePrevBtn'
                                onClick={() => handleKeyPress('x', setPhone)}
                            >
                                מחק
                            </button>
                        </div>
                        <button className='continueBtn' onClick={handleSubmitStep2}>
                            המשך
                        </button>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className='insertClinic'>
                        <div className='inputClinicBtn'>בחר קופת חולים</div>
                        <div className='allClinic'>
                            {clinicsList.map((clinic) => (
                                <button
                                    key={clinic.ID}
                                    className='clinic'
                                    onClick={() => handleClinicSelection(clinic.ID)}
                                >
                                    {clinic.Name}
                                </button>
                            ))}
                            <button className='continueBtn' onClick={handleClinicSubmit}>
                                אישור
                            </button>
                        </div>
                    </div>
                )}

                {currentStep === 4 && (
                    <div className='numberNote'>
                        <div className='patientInfo'>
                            <div className='numberCont'>
                                <div>מספרך בתור:</div>
                                <div className='uniqueNumber'>{patientDetails.UniqueNumber}</div>
                            </div>
                            <div className='moreDetails'>תעודת זהות: {patientDetails.Tz}</div>
                            <div className='moreDetails'>מספר טלפון: {patientDetails.Phone}</div>
                            <div className='moreDetails'>קופת חולים: {patientDetails?.HMO?.Name || ''}</div>
                            <div className='moreDetails'>שעה: {currentTime}</div>
                        </div>
                        <div className='saveNumber'>
                            יש לשמור את המספר לאורך הטיפול
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientEnter;