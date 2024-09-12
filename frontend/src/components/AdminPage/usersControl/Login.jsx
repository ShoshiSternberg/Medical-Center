import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from '../../../logo.png';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LoadingButton from '@mui/lab/LoadingButton';
import { getUserByEmailAddress, userLogin } from '../../../clientServices/UserService';
import emailjs from 'emailjs-com';
import { getRoleById } from '../../../clientServices/RoleService';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    emailjs.init('OGeC5v16OEXHrsSlr');

    const [user, setUser] = useState({
        Password: '',
        Email: '',
    });

    const [isForgotPassword, setIsForgotPassword] = useState(false);

    const handleChange = (event) => {
        setUser({
            ...user,
            [event.target.name]: event.target.value,
        });
    };

    const handleUserLogin = async (e) => {
        console.log(1)

        //e.preventDefault();
        try {

            const userData = await userLogin(user);
            if (userData != null) {
                sessionStorage.setItem('email', userData.data.Email);
                sessionStorage.setItem('name', userData.data.Name);

                var role = await getRoleById(userData.data.RoleID);
                sessionStorage.setItem('role', role.data.Role);
                if (userData.data.RoleID === 1) {
                    navigate('/admin', { state: 1 });
                } else if (userData.data.RoleID === 2) {
                    navigate('/pagesNavigate', { state: 2 });
                } else {
                    navigate('/pagesNavigate', { state: 3 });
                }
            }
        } catch (error) {

            console.error('בעיה בכניסת משתמש',3, error);
            alert("שגיאה בהזנת הפרטים");
        }
    };

    const generateRandomPassword = () => {
        const characters = '0123456789';
        let password = '';
        for (let i = 0; i < 10; i++) {
            password += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return password;
    };

    const handleForgotPassword = async (e) => {

        if (!user.Email) {
            alert("נא הכנס כתובת מייל");
        } else {
            try {
                const isExist = await getUserByEmailAddress(user.Email);
                if (!isExist || !isExist.data) {
                    alert("מייל זה לא קיים במערכת");
                } else {
                    sessionStorage.setItem('email', isExist.data.Email);
                    sessionStorage.setItem('name', isExist.data.Name);

                    var role = await getRoleById(isExist.data.RoleID);
                    sessionStorage.setItem('role', role.data.Role);

                    const generatedPassword = generateRandomPassword();
                    const templateParams = {
                        to_name: isExist.Name,
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
                            navigate('/checkPassword', { state: generatedPassword });
                        })
                        .catch((error) => {
                            console.error('FAILED...', error);
                        });
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    alert("מייל זה לא קיים במערכת");
                } else {
                    console.error('Error fetching user:', error);
                    alert("An error occurred. Please try again later.");
                }
            }
        }
    };


    return (
        <>
            <div className='loginPageCont'>
                <div className="login-container">
                    <img className='logo-img' alt='logo' src={logo} />

                    <div className='login-title'>כניסת משתמש</div>
                    <form className='login-form' onSubmit={handleUserLogin}>
                        <input
                            className='login-input'
                            type="email"
                            name="Email"
                            placeholder='אימייל'
                            value={user.Email}
                            onChange={handleChange}
                            required
                        />
                        {!isForgotPassword && (
                            <input
                                className='login-input'
                                type="password"
                                name="Password"
                                placeholder='סיסמא'
                                value={user.Password}
                                onChange={handleChange}
                                required
                            />
                        )}
                        {!isForgotPassword && (
                            <LoadingButton
                                className='login-btn'
                                loading={loading}
                                sx={{
                                    backgroundColor: 'transparent', // Remove default background
                                    boxShadow: 'none', // Remove default shadow
                                    '&:hover': {
                                      backgroundColor: 'transparent', // Ensure no hover effect
                                    },
                                    color: '#ffffff', // Customize text color
                                    border: 'none', // Remove border
                                    padding: '10px 30px 10px 30px',
                                    borderRadius: '100px',
                                    // Adjust padding if needed
                                  }}
                                type="submit"
                                onClick={() => { setLoading(true); handleUserLogin(); }}
                            >
                                <span className='pagesNavigate-text'>
                                    כניסה
                                </span>
                                <ArrowBackIcon />
                            </LoadingButton>
                        )}
                    </form>
                    <button
                        className='forgot-password-btn'
                        onClick={(e) => {
                            setIsForgotPassword(true);
                            handleForgotPassword(e);
                        }}
                    >
                        שכחתי סיסמא
                    </button>
                </div>
            </div>
        </>
    );
};

export default Login;
