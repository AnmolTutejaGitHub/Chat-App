import { Navigate, useLocation } from 'react-router-dom';
import './Room.css';
import { io } from "socket.io-client";
import { useEffect, useState } from 'react';
import { IoSend } from "react-icons/io5";
import { useContext } from 'react';
import UserContext from '../../Context/UserContext';
import axios from 'axios';
import Messagejsx from './Messagejsx';
import ScrollToBottom from 'react-scroll-to-bottom';
import { BiSolidExit } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import { PiUploadSimpleBold } from "react-icons/pi";

function Room() {

    const navigate = useNavigate();
    const location = useLocation();
    const roomData = location.state;
    const { user, setUser } = useContext(UserContext);

    const [Users, setUsers] = useState([]);

    const SOCKET_SERVER_URL = `wss://${process.env.REACT_APP_BACKEND_URL}`;
    const socket = io(SOCKET_SERVER_URL);

    const [messages, setMessages] = useState([]);
    const [enteredValue, setEnteredValue] = useState('');

    const renderMessages = messages.map((msg, index) => {
        return <div key={index}>{msg}</div>;
    });

    useEffect(() => {
        getHistory();
        socket.emit('join', { username: user, room: roomData.room_name });

        socket.on("message", (message) => {
            const mess = (
                <Messagejsx _key={new Date()} username={message?.username} timestamp={message.timestamp} msg={message.msg} />
            );
            setMessages((prevMessages) => [...prevMessages, mess]);
        });

        socket.on("userJoined", () => {
            FetchUsers();
        });

        socket.on("userLeft", () => {
            FetchUsers();
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
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/roomMessages`, {
            room_name: roomData.room_name
        });

        if (response.status === 200) {

            const msgs = response.data.map((msgObj, index) => (
                <Messagejsx _key={index} username={msgObj.username} timestamp={msgObj.timestamp} msg={msgObj.message} />
            ));

            setMessages(msgs);
        }
    }


    async function FetchUsers() {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/roomUsers`, {
                room_name: roomData.room_name
            });

            if (response.status === 200) {
                const users = response.data;
                setUsers(users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }


    const renderUsers = Users.map((user) => {
        return <div>{user.username}</div>
    })

    function InputEnterMessageSend(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    }

    function leaveRoom() {
        socket.disconnect();
        navigate("/home");
    }

    return (
        <div className='room-div'>
            <div className='sidebar'>{renderUsers}</div>
            <div className='room-name'>{roomData.room_name}
                <BiSolidExit className='leave-btn' onClick={leaveRoom} />
            </div>
            <div>
                <ScrollToBottom className='scroll-css'>
                    <div className='messages'>{renderMessages}</div>
                </ScrollToBottom>
            </div>
            <div className='send-div'>
                <div className='input-msg'>
                    <input className='send-input' onChange={(e) => setEnteredValue(e.target.value)} value={enteredValue} onKeyPress={InputEnterMessageSend}></input>
                    <PiUploadSimpleBold className='file-upload' />
                </div>
                <IoSend className='send-btn' onClick={sendMessage} />
            </div>
        </div>
    );
}
export default Room;