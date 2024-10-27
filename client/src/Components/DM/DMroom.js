import { io } from "socket.io-client";
import Messagejsx from "../Room/Messagejsx";
import { useLocation } from 'react-router-dom';
import { useState } from "react";
import { useContext, useEffect } from 'react';
import axios from 'axios';
import UserContext from '../../Context/UserContext';
import ScrollToBottom from 'react-scroll-to-bottom';
import { useNavigate } from 'react-router-dom';
import { AiFillHome } from "react-icons/ai";
import { ToastContainer, toast } from 'react-toastify';
import { FaPaperclip } from 'react-icons/fa';
import { MdUpload } from "react-icons/md";
import { ReactMediaRecorder } from "react-media-recorder";
import { AiOutlineAudioMuted } from "react-icons/ai";
import { AiOutlineAudio } from "react-icons/ai";

function DMroom() {
    const SOCKET_SERVER_URL = `${process.env.REACT_APP_BACKEND_URL}`;
    const socket = io(SOCKET_SERVER_URL);
    const [messages, setMessages] = useState([]);
    const location = useLocation();
    const roomData = location.state;
    const [enteredValue, setEnteredValue] = useState('');
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [sending, setSending] = useState(false);
    const notify = (text) => toast(text);
    const [recording, setRecording] = useState(false);

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


    const handleFileSubmit = async (e) => {
        e.preventDefault();
        setSending(true);

        const fileInput = document.getElementById('uploadfile');
        //const fileInput = e.target.elements.uploadfile;
        const file = fileInput.files[0];
        console.log(file);

        if (!file) {
            notify('Please select a file');
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
            socket.emit('SendDMMessage', { room_name: roomData.room, msg: result.url, sender: roomData.sender });

        } catch (error) {
            console.error(error);
        } finally {
            setSending(false);
        }
    };

    const sendAudio = async (mediaBlobUrl) => {
        try {
            const response = await fetch(mediaBlobUrl);
            const blob = await response.blob();
            const file = new File([blob], "recording.mp3", { type: "audio/mpeg" });

            const formData = new FormData();
            formData.append('uploadfile', file);

            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/fileupload`, {
                method: 'POST',
                body: formData
            });

            const result = await res.json();
            socket.emit('SendDMMessage', { room_name: roomData.room, msg: result.url, sender: roomData.sender });

            console.log("Audio sent successfully");
        } catch (error) {
            console.error("Error sending audio:", error);
        }
    }


    return (<div className="dmroom">
        {/* <ToastContainer /> */}
        <div className='room-name-DM'>{roomData.sender == roomData.receiver ? "Myself" : roomData.receiver}
            <AiFillHome className="home-icon" onClick={leaveRoom} />
        </div>
        <ScrollToBottom className='scroll-css-dm'>
            <div className='messages dm-messages'>{renderMessages}</div>
        </ScrollToBottom>
        <div className='send-div-DM'>
            <div className='input-msg-DM'>
                <input className='send-input-DM' onChange={(e) => setEnteredValue(e.target.value)} value={enteredValue} onKeyPress={InputEnterMessageSend}></input>
                <form onSubmit={handleFileSubmit} encType="multipart/form-data" className="uploadform">
                    <input type="file" name="uploadfile" id="uploadfile" style={{ display: 'none' }} />
                    <label htmlFor="uploadfile" style={{ cursor: 'pointer' }}>
                        <FaPaperclip size={24} className="clip" />
                    </label>
                    <button type="submit" disabled={sending} className="uploadbtn">
                        <MdUpload className="upload-icon" />
                    </button>
                    <ReactMediaRecorder
                        audio
                        onStop={(blobUrl) => sendAudio(blobUrl)}
                        render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
                            <div>
                                <button className="audio-btn"
                                    onClick={() => {
                                        if (status === 'idle' || status === 'stopped') {
                                            setRecording(true);
                                            startRecording();
                                        } else {
                                            stopRecording();
                                            setRecording(false);
                                        }
                                    }}
                                >
                                    {recording ? <AiOutlineAudio /> : <AiOutlineAudioMuted />}
                                </button>
                            </div>
                        )}
                    />
                </form>
            </div>
            <div className='send-btn-DM' onClick={sendMessage}>Send</div>
        </div>

    </div>);
}
export default DMroom;