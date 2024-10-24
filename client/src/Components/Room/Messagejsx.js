import './Room.css';
function Messagejsx({ _key, timestamp, username, msg }) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    const parseMessage = (message) => {
        return message.split(urlRegex).map((part, index) => {
            if (urlRegex.test(part)) {
                return <a className="msg-url" key={index} href={part} target="_blank" rel="noopener noreferrer">{part}</a>;
            }
            return part;
        });
    };
    return (<div className="message" key={_key}>
        <div className="message-header">
            <span className="message-username">{username}</span>
            <span>{' '}</span>
            <span className="message-timestamp">{timestamp}</span>
        </div>
        <div className="message-body">
            {parseMessage(msg)}
        </div>
    </div>);
}

export default Messagejsx;