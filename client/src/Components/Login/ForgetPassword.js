import { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ForgetPassword() {
    const [enteredOTP, setEnteredOTP] = useState('');
    const [generatedotp, setgeneratedotp] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const notify = (text) => toast.success(text);

    function reset() {

    }

    function generateOTP() {
        let otp = '';
        for (let i = 0; i < 4; i++) {
            const digit = Math.floor(Math.random() * 10);
            otp += digit.toString();
        }
        return otp;
    }

    async function sendOTP(e) {
        e.preventDefault();
        const newOTP = generateOTP();
        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/otp`, { email, otp: newOTP });
            setError("");
            setgeneratedotp(newOTP);
            notify("Otp sent Successfully!");
        } catch (e) {
            setError("Error sending OTP");
        }
    }

    async function reset(e) {
        e.preventDefault();
        setError('');

        if (!email.trim()) return setError('please Enter Email');
        if (!generatedotp.trim()) return setError('OTP verification failed');
        if (!enteredOTP.trim()) return setError('Please enter the OTP code');
        if (!password.trim()) return setError('Please enter a new password');
        if (enteredOTP.trim() != generatedotp) return setError("OTP doesn't match");

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/resetpassword`, {
                email,
                password
            });

            notify('Password reset successful');
            setPassword('');
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            console.log(error);
            if (error?.response?.data?.message) setError(error?.response?.data?.message);
            else if (error?.response?.data?.error) setError(error.response.data.error);
            else setError('Error resetting password');
        }
    }

    return (
        <div className="forget-password-div">
            <ToastContainer />
            <div className='login-div'>
                <form className='login'>
                    <p>Reset Password</p>
                    <input placeholder="Enter Email" className='login-input' onChange={(e) => setEmail(e.target.value)} required></input>
                    <button className='nav-btn login-btn' onClick={sendOTP}>Send OTP</button>
                    <input placeholder="Enter OTP" className='login-input' onChange={(e) => setEnteredOTP(e.target.value)}></input>
                    <input placeholder="Enter New Password" className='login-input' onChange={(e) => setPassword(e.target.value)} ></input>
                    <button type="submit" className='nav-btn login-btn' onClick={(e) => reset(e)}>Reset</button>
                    {error && <p className="error">*{error}</p>}
                </form>
            </div>
        </div>
    );
}
export default ForgetPassword;