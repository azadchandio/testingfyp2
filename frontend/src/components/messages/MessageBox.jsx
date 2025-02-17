import React from 'react';
import './MessageBox.css';

const MessageBox = () => {
  return (
    <div className="message-box">
      <div className="message-header">
        <h3>Messaging Inbox</h3>
        <div className="message-tabs">
          <span>All Messages (3)</span>
          <span>Buyers Messages (1)</span>
          <span>Sellers Messages (2)</span>
        </div>
      </div>
      <div className="message-list">
        <div className="message-item">
          <span className="message-sender">Devon Lane</span>
          <span className="message-amount">(600 PW)</span>
          <p className="message-preview">Lorem ipsum Dolor Sit Amet, Consec...</p>
        </div>
        <div className="message-item">
          <span className="message-sender">Kathryn Murphy</span>
          <span className="message-amount">(0.25 PW)</span>
          <p className="message-preview">Lorem ipsum Dolor Sit Amet, Consec...</p>
        </div>
        <div className="message-item">
          <span className="message-sender">Jacob Jones</span>
          <span className="message-amount">(0.34 PW)</span>
          <p className="message-preview">Lorem ipsum Dolor Sit Amet, Consec...</p>
        </div>
        <div className="message-item">
          <span className="message-sender">Ralph Edwards</span>
          <span className="message-amount">(0.46 AW)</span>
          <p className="message-preview">Lorem ipsum Dolor Sit Amet, Consec...</p>
        </div>
        <div className="message-item">
          <span className="message-sender">Wade Warren</span>
          <span className="message-amount">(0.32 PW)</span>
          <p className="message-preview">Lorem ipsum Dolor Sit Amet, Consec...</p>
        </div>
      </div>
      <div className="message-conversation">
        <div className="conversation-header">
          <span className="sender-name">Devon Lane</span>
          <span className="sender-status">Online</span>
        </div>
        <div className="conversation-listing">
          <span>Vauxhall Grandland</span>
          <span>Rs 89,000,000</span>
          <span>@To Listing</span>
        </div>
        <div className="conversation-messages">
          <div className="message-bubble">
            <p>Hello! Are You in The Market For A New Vehicle?</p>
          </div>
          <div className="message-bubble user">
            <p>Buyer: Absolutely! What Options Do You Have?</p>
          </div>
        </div>
        <div className="message-input">
          <input type="text" placeholder="Write Your Message..." />
        </div>
      </div>
    </div>
  );
};

export default MessageBox;