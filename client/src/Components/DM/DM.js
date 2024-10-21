import { FaSearch } from "react-icons/fa";
import './DM.css';
import { useState } from "react";
import { useContext, useEffect } from 'react';
import UserContext from '../../Context/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function DM() {

    const [EnteredUsername, setUsername] = useState('');
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();


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
                room_name: sortedRoomName
            });

            const roomData = {
                sender: user,
                receiver: receiver,
                room: sortedRoomName
            }
            navigate('/DMroom', { state: roomData });
        }
    }

    return (
        <div>
            <div className='input-nav-box search-position'>
                <input placeholder="Search by username...." className='nav-input' onChange={(e) => setUsername(e.target.value)}></input>
                <FaSearch className='search-icon' onClick={EstablishDM} />
            </div>
        </div>
    );
}
export default DM;