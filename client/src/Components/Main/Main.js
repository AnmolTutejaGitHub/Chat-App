import Typewriter from 'typewriter-effect';
import { useState } from 'react';
import { useContext, useEffect } from 'react';
import UserContext from '../../Context/UserContext';
import './Main.css';
import { useNavigate } from 'react-router-dom';

function Main() {
    const [firstTypewriterDone, setFirstTypewriterDone] = useState(false);
    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    return (
        <div className='__main'>
            <div className='welcome welcome-main' id="typewriter">
                <Typewriter
                    onInit={(typewriter) => {
                        typewriter.typeString(`Welcome ${user} `)
                            .pauseFor(2500)
                            .deleteAll()
                            .callFunction(() => setFirstTypewriterDone(true))
                            .start()
                    }}
                />
            </div>

            {firstTypewriterDone && <div className='welcome welcome-main' id="typewriter">
                You can
                <Typewriter
                    onInit={(typewriter) => {
                        typewriter.typeString(` Join a Room ! `)
                            .pauseFor(2500)
                            .deleteAll()
                            .typeString(` Message Someone `)
                            .start()
                    }}
                />
            </div>}

            <div className='nav-conversations'>
                <div className='welcome welcome-main-hover'>Join Rooms <span className='animation-main' onClick={() => navigate('/home')}>{`Join >>`}</span></div>
                <div className='welcome welcome-main-hover'>Start A Private Conversation <span className='animation-main' onClick={() => navigate('/DM/*')}>{`Start >>`}</span></div>
            </div>
        </div>
    );
}

export default Main;