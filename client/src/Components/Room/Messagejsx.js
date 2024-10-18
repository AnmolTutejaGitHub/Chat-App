import './Room.css';
function Messagejsx({ _key, timestamp, username, msg }) {
    return (<div className="message" key={_key}>
        <div className="message-header">
            <span className="message-username">{username}</span>
            <span>{' '}</span>
            <span className="message-timestamp">{timestamp}</span>
        </div>
        <div className="message-body">
            {msg}
        </div>
    </div>);
}

export default Messagejsx;