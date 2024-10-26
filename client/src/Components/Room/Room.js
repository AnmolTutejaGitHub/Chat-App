import { Navigate, useLocation, useSearchParams } from 'react-router-dom';
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
import { FaPaperclip } from 'react-icons/fa';
import { MdUpload } from "react-icons/md";

function Room() {

    const navigate = useNavigate();
    const location = useLocation();
    //const roomData = location.state;
    const { user, setUser } = useContext(UserContext);

    const [Users, setUsers] = useState([]);

    const SOCKET_SERVER_URL = `${process.env.REACT_APP_BACKEND_URL}`;
    const socket = io(SOCKET_SERVER_URL);

    const [messages, setMessages] = useState([]);
    const [enteredValue, setEnteredValue] = useState('');

    const [searchParams] = useSearchParams();
    const roomData = location.state || { room_name: searchParams.get('room_name') };

    const renderMessages = messages.map((msg, index) => {
        return <div key={index}>{msg}</div>;
    });

    useEffect(() => {
        if (!user && !searchParams.has('room_name')) navigate('/');
    }, []);

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
        if (!user) navigate('/');
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
        navigate("/main");
    }

    const handleFileSubmit = async (e) => {
        e.preventDefault();

        //const fileInput = e.target.elements.uploadfile;
        const fileInput = document.getElementById('uploadfile');
        const file = fileInput.files[0];

        if (!file) {
            return;
        }

        const formData = new FormData();
        formData.append('uploadfile', file);

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/fileupload`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            socket.emit('SendMessage', { room_name: roomData.room_name, msg: result.url, username: user });

        } catch (error) {
            console.error(error);
        }
    };


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
                    <form onSubmit={handleFileSubmit} encType="multipart/form-data" className="uploadform">
                        <input type="file" name="uploadfile" id="uploadfile" style={{ display: 'none' }} />
                        <label htmlFor="uploadfile" style={{ cursor: 'pointer' }}>
                            <FaPaperclip size={24} className="clip" />
                        </label>
                        <button type="submit" className="uploadbtn">
                            <MdUpload className="upload-icon" />
                        </button>
                    </form>
                </div>
                <IoSend className='send-btn' onClick={sendMessage} />
            </div>
        </div>
    );
}
export default Room;