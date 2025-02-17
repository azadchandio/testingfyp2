import React from 'react';
import './MessageBox.css';

const MessageBox = () => {
  return (
    <div className="messaging-container">
      <h2 className="messaging-title">Messaging Inbox.</h2>
      
      <div className="message-tabs">
        <button className="tab active">All Messages (3)</button>
        <button className="tab">Buyers Messages (1)</button>
        <button className="tab">Sellers Messages (2)</button>
      </div>

      <div className="messages-list">
        <div className="date-separator">TODAY</div>
        
        <div className="message-item">
          <div className="message-left">
            <img src="/avatar1.jpg" alt="User avatar" className="user-avatar" />
            <div className="user-info">
              <h4>Devon Lane</h4>
              <p className="message-preview">Lorem ipsum dolor sit amet, consec...</p>
            </div>
          </div>
          <div className="message-right">
            <span className="message-time">05:09 PM</span>
          </div>
        </div>

        {/* More message items can be added here */}
      </div>

      <div className="message-detail">
        <div className="chat-header">
          <div className="chat-user-info">
            <img src="/avatar1.jpg" alt="User avatar" className="user-avatar" />
            <div>
              <h4>Devon Lane</h4>
              <div className="product-info">
                <img src="/car-image.jpg" alt="Product" className="product-image" />
                <span className="product-name">Vauxhall Grandland</span>
                <span className="product-price">Rs 80,00,000</span>
              </div>
            </div>
          </div>
          <button className="go-to-listing">Go To Listing</button>
        </div>

        <div className="chat-messages">
          {/* Chat messages will go here */}
        </div>

        <div className="message-input">
          <input type="text" placeholder="Write Your Message..." />
          <div className="input-actions">
            <button className="voice-btn"><i className="mic-icon"></i></button>
            <button className="attach-btn"><i className="attach-icon"></i></button>
            <button className="send-btn"><i className="send-icon"></i></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBox; 