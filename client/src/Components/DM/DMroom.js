import { io } from "socket.io-client";
import Messagejsx from "../Room/Messagejsx";
import { Navigate, useLocation } from 'react-router-dom';
import { useState } from "react";
import { useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import UserContext from '../../Context/UserContext';
import ScrollToBottom from 'react-scroll-to-bottom';
import { BiSolidExit } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import { PiUploadSimpleBold } from "react-icons/pi";
import { AiFillHome } from "react-icons/ai";


function DMroom() {
    const SOCKET_SERVER_URL = `${process.env.REACT_APP_BACKEND_URL}`;
    const socket = io(SOCKET_SERVER_URL);
    const [messages, setMessages] = useState([]);
    const location = useLocation();
    const roomData = location.state;
    const [enteredValue, setEnteredValue] = useState('');
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();


    const renderMessages = messages.map((msg, index) => {
        return <div key={index}>{msg}</div>;
    });


    function sendMessage() {
        socket.emit('SendDMMessage', { room_name: roomData.room, msg: enteredValue, sender: roomData.sender });
        setEnteredValue('');
    }

    useEffect(() => {
        getHistory();
        socket.emit('joinDM', { sender: roomData.sender, receiver: roomData.receiver, room: roomData.room });

        socket.on("DMMessage", (message) => {
            const mess = (
                <Messagejsx _key={new Date()} username={message.sender} timestamp={message.timestamp} msg={message.msg} />
            );
            setMessages((prevMessages) => [...prevMessages, mess]);
        });
        return () => {
            socket.disconnect();
        };
    }, [roomData.room, user]);


    async function getHistory() {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/roomMessages`, {
            room_name: roomData.room
        });

        if (response.status === 200) {
            const msgs = response.data
                .filter(msgObj => msgObj.username) // left/joined msgs fixxed
                .map((msgObj, index) => (
                    <Messagejsx
                        key={index}
                        username={msgObj.username}
                        timestamp={msgObj.timestamp}
                        msg={msgObj.message}
                    />
                ));
            setMessages(msgs);
        }
    }

    function InputEnterMessageSend(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    }

    function leaveRoom() {
        socket.disconnect();
        navigate("/main");
    }

    return (<div className="dmroom">
        <div className='room-name-DM'>{roomData.sender == roomData.receiver ? "Myself" : roomData.receiver}
            <AiFillHome className="home-icon" onClick={leaveRoom} />
        </div>
        <ScrollToBottom className='scroll-css-dm'>
            <div className='messages dm-messages'>{renderMessages}</div>
        </ScrollToBottom>
        <div className='send-div-DM'>
            <div className='input-msg-DM'>
                <input className='send-input-DM' onChange={(e) => setEnteredValue(e.target.value)} value={enteredValue} onKeyPress={InputEnterMessageSend}></input>
            </div>
            <div className='send-btn-DM' onClick={sendMessage}>Send</div>
            {/* <IoSend className='send-btn-DM' onClick={sendMessage} /> */}
        </div>

    </div>);
}
export default DMroom;