import { useEffect } from "react";
import { io } from "socket.io-client";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from "../Home/Home";
import Room from "../Room/Room";
import DM from "../DM/DM";

function App() {
    const SOCKET_SERVER_URL = "http://localhost:6969";

    useEffect(() => {
        const socket = io(SOCKET_SERVER_URL);

        socket.on("message", (message) => {
            console.log(message);
        });

        // Clean up the connection when the component unmounts
        return () => {
            socket.disconnect();
        };
    }, []);


    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/room" element={<Room />} />
                    <Route path="/DM" element={<DM />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;