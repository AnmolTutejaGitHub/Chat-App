import { useContext, useState } from 'react';
import UserContext from '../../../Context/UserContext';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [EnteredUser, setEnteredUser] = useState('');
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    console.log(user);
    function handleLogin() {
        setUser(EnteredUser);
        navigate('/home');

    }
    return (<div>
        <input placeholder="enter username" onChange={(e) => { setEnteredUser(e.target.value) }}></input>
        <button onClick={handleLogin}>temp login</button>
    </div>)
}
export default Login;