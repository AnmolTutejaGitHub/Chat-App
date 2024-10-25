import { FaSearch } from "react-icons/fa";
import './DM.css';
import { useState } from "react";
import { useContext, useEffect } from 'react';
import UserContext from '../../Context/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DMroom from "./DMroom";
import { Route, Routes } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function DM() {

    const [EnteredUsername, setUsername] = useState('');
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [friends, setFriends] = useState([]);
    const location = useLocation();
    const isDMRoom = location.pathname.includes('/DMroom');


    useEffect(() => {
        fetchFriends();
    }, [user])
    async function getSearchedUserId(name) {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/findUser`, {
                searchUser: name
            });

            return response.data;

        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async function EstablishDM() {
        const receiver = EnteredUsername;
        const receiver_id = await getSearchedUserId(EnteredUsername);
        const sender_id = await getSearchedUserId(user);

        if (receiver_id && sender_id) {
            const room = sender_id + receiver_id;

            const sortedRoomName = room.split('').sort().join('');

            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/createOrGetDMRoom`, {
                room_name: sortedRoomName,
                receiver,
                sender: user
            });

            const roomData = {
                sender: user,
                receiver: receiver,
                room: sortedRoomName
            }

            await fetchFriends();

            navigate(`DMroom`, { state: roomData });
        }

        else {
            setError('username does not exist in database');
        }

        setUsername('');
    }

    async function fetchFriends() {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/getFriends`, {
            user: user
        })
        setFriends(response.data);
    }

    const renderFriends = friends.map((friend, index) => (
        <div key={index} className="DM-chat" onClick={() => { handleFriendClick(friend) }}>
            <img src={`https://ui-avatars.com/api/?name=${friend}`} className="friend-logo" />
            <p>{user === friend ? "myself" : friend}</p>
            {/* <FiMessageCircle className="msg-icon" /> */}
        </div >
    ));

    async function handleFriendClick(friend) {

        const receiver_id = await getSearchedUserId(friend);
        const sender_id = await getSearchedUserId(user);

        const room = sender_id + receiver_id;
        const sortedRoomName = room.split('').sort().join('');

        const roomData = {
            sender: user,
            receiver: friend,
            room: sortedRoomName
        }
        navigate(`DMroom`, { state: roomData });
    }

    return (
        <div className={`DM-div ${isDMRoom ? 'show-messages' : ''}`}>
            <div className="DM-sidebar">
                <div className='input-nav-box search-position'>
                    <input placeholder="Search by username...." className='nav-input search-user-input' onChange={(e) => { setUsername(e.target.value); setError('') }} onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            EstablishDM();
                        }
                    }} value={EnteredUsername}></input>
                    <FaSearch className='search-icon' onClick={EstablishDM} />
                </div>
                {error && <p className="error error-dm">*{error}</p>}
                <div className="DM-chats">
                    {renderFriends}
                </div>
            </div>

            <>
                <div className="desktop-dms">
                    <Routes>
                        <Route path="DMroom" element={<DMroom />} />
                    </Routes>
                </div>

                <div className="mobile-dms">
                    <Routes>
                        <Route path="DMroom" element={<DMroom />} />
                    </Routes>
                </div>
            </>
        </div>
    );
}
export default DM;