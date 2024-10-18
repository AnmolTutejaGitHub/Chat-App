import { useState } from 'react';
import './Home.css';
import { IoClose } from "react-icons/io5";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";
import { useContext, useEffect } from 'react';
import UserContext from '../../Context/UserContext';
import { BiLogOut } from "react-icons/bi";

function Home() {

    const navigate = useNavigate();
    const [CreateRoom, setCreateRoom] = useState('');
    const [CreateRoomModal, setCreateRoomModal] = useState(false);
    const [error, setError] = useState('');
    const [SearchRoom, setSearchRoom] = useState('');
    const [searchError, setSearchError] = useState('');
    const { user, setUser } = useContext(UserContext);

    useEffect(() => {
        if (!user) logout();
    }, []);
    async function createRoom() {
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/createRoom`, {
                room_name: CreateRoom
            });

            if (res.status === 200) setError('room created successfully');
            else setError('room name already taken');

            const roomData = { room_name: CreateRoom };
            navigate('/room', { state: roomData });

        } catch (e) {
            setError(e.response?.data?.message || 'room name already taken');
        }
    }


    async function search() {
        try {

            if (SearchRoom.trim() == '') {
                setSearchError("Room name can't be empty");
                return;
            }
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/allRooms`, {
                room_name: SearchRoom
            });

            if (response.status === 200) {
                const roomData = { room_name: SearchRoom };
                navigate('/room', { state: roomData });
                setSearchRoom('');
            }
        } catch (error) {
            setSearchError("Room with this name doesn't exist");
        }
    }

    function logout() {
        localStorage.removeItem('user');
        setUser('');
        navigate('/');
    }


    return (
        <div className="home">
            <BiLogOut className="logout" onClick={logout} />
            <div className='home__main'>
                <div className='welcome'>Welcome {user}</div>
                <div className="nav-search">
                    <div className='input-nav-box'>
                        <input placeholder="Search for Rooms..." className='nav-input' onChange={(e) => { setSearchRoom(e.target.value); setSearchError(''); }}></input>
                        <FaSearch className='search-icon' onClick={search} />
                    </div>
                    <div className='nav-btns'>
                        <div>
                            <button className='nav-btn' onClick={() => { setCreateRoomModal(true) }}>Create Room</button>
                            {
                                CreateRoomModal && <div className='create-room-modal'>
                                    <IoClose className='close-create-room' onClick={() => { setCreateRoomModal(false); setError('') }} />
                                    <input placeholder='Enter Room Name ...' className='create-room-input' onChange={(e) => { setCreateRoom(e.target.value); }}></input>
                                    <button className='nav-btn' onClick={createRoom}>create</button>
                                    {error && <p className='error'>*{error}</p>}
                                </div>
                            }
                        </div>
                        <button className='nav-btn'>messages</button>
                    </div>
                    {searchError && <div className='error'>*{searchError}</div>}
                </div>

                <div className='rooms'></div>
            </div>
        </div>
    );
}
export default Home;