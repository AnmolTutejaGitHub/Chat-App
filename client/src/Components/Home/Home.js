import './Home.css';
function Home() {
    return (
        <div className="home">
            <div className='home__main'>
                <div className="nav-search">
                    <input placeholder="Search for Rooms..." className='nav-input'></input>
                    <div className='nav-btns'>
                        <button className='nav-btn'>Create Room</button>
                        <button className='nav-btn'>messages</button>
                    </div>
                </div>

                <div className='rooms'></div>
            </div>
        </div>
    );
}
export default Home;