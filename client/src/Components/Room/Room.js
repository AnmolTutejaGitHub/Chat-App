import { useLocation } from 'react-router-dom';
import './Room.css';
import { io } from "socket.io-client";
import { useEffect, useState } from 'react';
import { IoSend } from "react-icons/io5";
import { useContext } from 'react';
import UserContext from '../../Context/UserContext';
import axios from 'axios';
function Room() {

    const location = useLocation();
    const roomData = location.state;
    const { user, setUser } = useContext(UserContext);
    console.log(user);

    const SOCKET_SERVER_URL = "http://localhost:6969";
    const socket = io(SOCKET_SERVER_URL);

    const [messages, setMessages] = useState([]);
    const [enteredValue, setEnteredValue] = useState('');

    const renderMessages = messages.map((msg, index) => {
        return <p key={index}>{msg}</p>;
    });

    useEffect(() => {
        getHistory();
        socket.emit('join', { username: user, room: roomData.room_name });

        socket.on("message", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.disconnect();
        };
    }, [roomData.room_name, user]);



    function sendMessage() {
        socket.emit('SendMessage', { room_name: roomData.room_name, msg: enteredValue, username: user });
        setEnteredValue('');
    }

    async function getHistory() {
        const response = await axios.post('http://localhost:6969/roomMessages', {
            room_name: roomData.room_name
        });

        if (response.status === 200) {

            const msgs = response.data.map(msgObj => msgObj.username ? `${msgObj.message} by ${msgObj.username} at ${msgObj.timestamp}` : msgObj.message);

            setMessages(msgs);
        }
    }

    return (
        <div>
            <p>{roomData.room_name}</p>
            <div>{renderMessages}</div>
            <div className='send-div'>
                <input className='send-input' onChange={(e) => setEnteredValue(e.target.value)} value={enteredValue}></input>
                <IoSend className='send-btn' onClick={sendMessage} />
            </div>
        </div>
    );
}
export default Room;