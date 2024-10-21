import { useEffect } from "react";
import { io } from "socket.io-client";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from "../Home/Home";
import Room from "../Room/Room";
import DM from "../DM/DM";
import Login from "../Login/Login";
import Signup from "../Signup/Signup";
import OTPValidation from "../OTPValidation/OTPValidation";
import DMroom from "../DM/DMroom";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/room" element={<Room />} />
                    <Route path="/DM" element={<DM />} />
                    <Route path="/DMroom" element={<DMroom />} />
                    <Route path="/OTPValidation" element={<OTPValidation />}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;