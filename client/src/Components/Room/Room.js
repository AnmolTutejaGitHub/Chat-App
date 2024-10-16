import './Room.css';
import { io } from "socket.io-client";
import { useEffect, useState } from 'react';
import { IoSend } from "react-icons/io5";
function Room() {
    const SOCKET_SERVER_URL = "http://localhost:6969";
    const socket = io(SOCKET_SERVER_URL);
    const [messages, setMessages] = useState([]);
    const [enteredValue, setEnteredValue] = useState('');

    const renderMessages = messages.map((msg, index) => {
        return <p key={index}>{msg}</p>;
    });

    useEffect(() => {
        socket.on("message", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);



    function sendMessage() {
        socket.emit('SendMessage', enteredValue);
        setEnteredValue('');
    }

    return (
        <div>
            <div>{renderMessages}</div>
            <div className='send-div'>
                <input className='send-input' onChange={(e) => setEnteredValue(e.target.value)} value={enteredValue}></input>
                <IoSend className='send-btn' onClick={sendMessage} />
            </div>
        </div>
    );
}
export default Room;