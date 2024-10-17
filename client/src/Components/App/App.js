import { useEffect } from "react";
import { io } from "socket.io-client";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from "../Home/Home";
import Room from "../Room/Room";
import DM from "../DM/DM";
import Login from "./Login/Login";


function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/room" element={<Room />} />
                    <Route path="/DM" element={<DM />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;