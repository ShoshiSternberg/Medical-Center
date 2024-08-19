import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import './errorMessage.css';

function MyVerticallyCenteredModal(props) {

    const location = useLocation();
    const generatedPassword = location.state;

    const navigate = useNavigate();

    const [temporaryPassword, setTemporaryPassword] = useState();

    const [startTime, setStartTime] = useState(new Date().getTime());

    const [error, setError] = useState('');

    const [errorStatus, setErrorStatus] = useState(false);

    useEffect(() => {
        if (!sessionStorage.getItem('email')) {
            navigate('/pagesNavigate');
        }
        const timer = setInterval(() => {
            const currentTime = new Date().getTime();
            if (currentTime - startTime >= 5 * 60 * 1000) {
                setError("הזמן להכניס את הסיסמה הזמנית פג. בבקשה בקש סיסמה זמנית חדשה");
                setErrorStatus(true);
                // alert("5 minutes have passed since you started.");
                clearInterval(timer);
            }
        }, 50000);

        return () => clearInterval(timer);
    }, [navigate, startTime]);

    const checkTemporaryPassword = () => {
        if (temporaryPassword === generatedPassword) {
            navigate('/newPassword');
        }
        else {
            setError("הסיסמה שהכנסת אינה נכונה. אנא נסה שוב");
            // alert("The password is incorrect");
        }
    }

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    סיסמא זמנית
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>אנא הכנס את הסיסמא הזמנית שקיבלת למייל</h4>
                <form>
                    <input
                        type="password"
                        placeholder="Temporary Password"
                        value={temporaryPassword}
                        onChange={(e) => setTemporaryPassword(e.target.value)}
                    />
                    {error && (
                        <div>
                            <span className='errorMessage'>{error}</span>
                        </div>
                    )}
                </form>
            </Modal.Body>
            <Modal.Footer>
                {errorStatus && (
                    <Button onClick={() => navigate('/forgotPassword')}>
                        שכחתי סיסמה
                    </Button>
                )}
                {!errorStatus && (<Button onClick={checkTemporaryPassword}>אישור</Button>)}
            </Modal.Footer>
        </Modal>
    );
}



const ConfirmPassword = () => {

    return (
        <div>
            <MyVerticallyCenteredModal
                show={true}
            />
        </div>
    );
};

export default ConfirmPassword;