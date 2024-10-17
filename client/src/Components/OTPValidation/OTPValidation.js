import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import './OTPValidation.css';

function OTPValidation() {
    const navigate = useNavigate();
    const location = useLocation();
    const { email } = location.state || '';

    const [enteredOTP, setEnteredOTP] = useState('');
    const [sentOTP, setSentOTP] = useState('');
    const [error, setError] = useState('');
    const [otpSending, setSending] = useState(false);

    useEffect(() => {
        if (!email || email.trim() === '') navigate("/");
    }, []);

    async function sendOTP() {
        try {
            setSending(true);
            const otp = generateOTP();
            setSentOTP(otp);

            await axios.post(`http://localhost:6969/otp`, { email, otp });
            setError("");
            alert("OTP sent successfully!");
        } catch (e) {
            setError("Error sending OTP");
        } finally {
            setSending(false);
        }
    }

    async function validateOTP() {
        if (enteredOTP === '') return;
        if (sentOTP === enteredOTP) {
            navigate("/home");
        } else {
            setError("Invalid OTP");
        }
    }

    function generateOTP() {
        let otp = '';
        for (let i = 0; i < 4; i++) {
            const digit = Math.floor(Math.random() * 10);
            otp += digit.toString();
        }
        return otp;
    }

    return (
        <div className="login-page">
            <div className="login-div">
                <div className="otp-div">
                    <form className='login'>
                        <p>OTP Validation</p>
                        <input
                            placeholder="Enter OTP"
                            value={enteredOTP}
                            onChange={(e) => setEnteredOTP(e.target.value)}
                            className='login-input'
                        />
                        <button onClick={sendOTP} disabled={otpSending} className="nav-btn">Generate OTP</button>
                        <button onClick={validateOTP} className="nav-btn">Validate OTP</button>
                        {error && <p className="error">*{error}</p>}
                    </form>

                </div>
            </div>
        </div>
    );
}

export default OTPValidation;