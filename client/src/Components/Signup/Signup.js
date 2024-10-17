import { useContext, useState } from 'react';
import UserContext from '../../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../Login/Login.css';
import axios from 'axios';

function Signup() {
    const [EnteredUser, setEnteredUser] = useState('');
    const [EnteredEmail, setEnteredEmail] = useState('');
    const [EnteredPassword, setEnteredPassword] = useState('');
    const [Error, setError] = useState('');
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);

    async function SignUp() {
        try {
            const response = await axios.post('http://localhost:6969/signup', {
                email: EnteredEmail,
                password: EnteredPassword,
                name: EnteredUser
            });

            if (response.status === 200) {
                const token = response.data.token;
                console.log(token);
                localStorage.setItem('token', token);

                navigate("/");
            }
        } catch (error) {
            setError(error?.response?.data?.error || "Some error Occurred");
        }
    }

    return (
        <div className="login-page">
            <div className='login-div'>
                <form className='login' onSubmit={(e) => { e.preventDefault(); SignUp(); }}>
                    <p>Signup & Join Rooms</p>
                    <input placeholder="Enter Username" onChange={(e) => { setEnteredUser(e.target.value) }} className='login-input' required></input>
                    <input placeholder="Enter Email" onChange={(e) => { setEnteredEmail(e.target.value) }} className='login-input' required></input>
                    <input placeholder="Set Password" onChange={(e) => { setEnteredPassword(e.target.value) }} className='login-input' required></input>
                    <p>Already have an Account ? <span><Link to="/">Login</Link></span></p>
                    <button className='nav-btn' type="submit">Sign Up</button>
                    {Error && <p className='error'>*{Error}</p>}
                </form>
            </div>
        </div>
    );
}

export default Signup;