import { useState, useEffect } from 'react';

import { advertisementService } from '../../services/advertisement.service';
import './Messages.css';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await advertisementService.getMessages();
        setMessages(response);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="messages-container">
      <h2 className="messages-title">Messages<span className="dot">.</span></h2>
      {loading ? (
        <div className="loading">Loading messages...</div>
      ) : (
        <div className="messages-list">
          {messages.map(message => (
            <div key={message.id} className="message-item">
              <div className="message-header">
                <span className="sender">{message.sender.name}</span>
                <span className="date">{new Date(message.created_at).toLocaleDateString()}</span>
              </div>
              <p className="message-content">{message.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Messages; 