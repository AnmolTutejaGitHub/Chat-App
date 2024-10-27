import { useContext, useState, useEffect } from 'react';
import UserContext from '../../Context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import axios from 'axios';

function Login() {
    const [EnteredUser, setEnteredUser] = useState('');
    const [EnteredEmail, setEnteredEmail] = useState('');
    const [EnteredPassword, setEnteredPassword] = useState('');
    const [Error, setError] = useState('');
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate('/home');
    }, [user])

    async function handleLogin() {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/login`, {
                name: EnteredUser,
                email: EnteredEmail,
                password: EnteredPassword,
            });

            if (response.status === 200) {
                const token = response.data.token;
                //console.log(token);
                localStorage.setItem('token', token);
                setUser(EnteredUser);
                //navigate('/home');
                navigate('/OTPValidation', { state: { email: EnteredEmail } });
            }
        } catch (error) {
            setError(error?.response?.data?.error || "Some error Occurred");
        }
    }


    return (<div className="login-page">
        <div className='login-div'>
            <form className='login' onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                <p>Login & Join Rooms</p>
                <input placeholder="Enter Username" onChange={(e) => { setEnteredUser(e.target.value) }} className='login-input' required></input>
                <input placeholder="Enter Email" onChange={(e) => { setEnteredEmail(e.target.value) }} className='login-input' required></input>
                <input placeholder="Enter Password" onChange={(e) => { setEnteredPassword(e.target.value) }} className='login-input' required></input>
                <div className='login-link forget-pass'><Link to="/forgetpassword" className='login-link'>Forget Password?</Link></div>
                <p>Don't have an Account ? <span><Link to="/signup" className='login-link'>Signup</Link></span></p>
                <button type="submit" className='nav-btn login-btn'>Login</button>
                {Error && <p className='error'>*{Error}</p>}
            </form>
        </div>
    </div>);
}
export default Login; 