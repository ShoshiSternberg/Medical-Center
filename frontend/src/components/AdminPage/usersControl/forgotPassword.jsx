import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { getUserByEmailAddress } from '../../../clientServices/UserService';
import 'bootstrap/dist/css/bootstrap.min.css';
import emailjs from 'emailjs-com';
// import { getRoleById } from '../../../clientServices/RoleService';
import './errorMessage.css';

function MyVerticallyCenteredModal(props) {
    const navigate = useNavigate();

    const [email, setEmail] = useState();

    const [error, setError] = useState('');

    useEffect(() => {
        emailjs.init('OGeC5v16OEXHrsSlr');
    }, []);

    const generateRandomPassword = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+={}[]|;:<>,.?/';
        let password = '';
        for (let i = 0; i < 10; i++) {
            password += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return password;
    }

    const handleForgotPassword = async (e) => {

        if (!email) {
            setError("חובה להכניס כתובת מייל")
            // alert("Email address required");
        }
        else {
            var user = await getUserByEmailAddress(email);
            user = user.data;
            if (!user) {
                setError("כתובת המייל לא נמצאת, אנא הכנס כתובת מייל");
                // alert("Email not exist");
            }
            else {
                e.preventDefault();

                var generatedPassword;

                // var role = await getRoleById(user.RoleID);
                sessionStorage.setItem('email', user.Email);
                // sessionStorage.setItem('role', role.Role);

                generatedPassword = generateRandomPassword();
                const templateParams = {
                    to_name: user.Name,
                    to_email: user.Email,
                    message: generatedPassword,
                };

                emailjs.send(
                    'service_b5emsma', // service ID
                    'template_5f0jjve', // template ID
                    templateParams
                )
                    .then((response) => {
                        console.log('SUCCESS!', response.status, response.text);
                        // props.onHide();
                        navigate('/checkPassword', { state: generatedPassword });
                    })
                    .catch((error) => {
                        console.error('FAILED...', error);
                    });
            }
        }
    };

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body>
                <h4>הכנס כתובת מייל</h4>
                <form>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </form>
            </Modal.Body>
            <span className='errorMessage' dir='rtl'>כעת תקבל למייל סיסמא זמנית. הסיסמא תקפה למשך 5 דקות</span>
            <span className='errorMessage' dir='rtl'>{error}</span>
            <Modal.Footer>
                <Button onClick={() => navigate('/pagesNavigate')}>סגירה</Button>
                <Button onClick={handleForgotPassword}>שלח סיסמא זמנית</Button>
            </Modal.Footer>
        </Modal>
    );
}


const ForgotPassword = () => {

    return (
        <div>
            <MyVerticallyCenteredModal
                show={true}
            />
        </div>
    );
};

export default ForgotPassword;
