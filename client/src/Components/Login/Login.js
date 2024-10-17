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

    async function handleLogin() {
        try {
            const response = await axios.post('http://localhost:6969/login', {
                name: EnteredUser,
                email: EnteredEmail,
                password: EnteredPassword,
            });

            if (response.status === 200) {
                setUser(EnteredUser);
                navigate('/home');
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
                <p>Don't have an Account ? <span><Link to="/signup">Signup</Link></span></p>
                <button type="submit" className='nav-btn'>Login</button>
                {Error && <p className='error'>*{Error}</p>}
            </form>
        </div>
    </div>);
}
export default Login; 