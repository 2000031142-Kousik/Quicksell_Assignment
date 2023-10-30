import React from 'react';
import './Card.css';
import { AiFillSignal, AiOutlineClose } from 'react-icons/ai';

const Card = ({ ticket }) => {
  const getPriorityIcon = (priority) => {
    if (priority === 4) {
      return <AiFillSignal style={{ color: 'red', animation: 'blinking 1s infinite' }} />;
    } else if (priority === 3) {
      return <AiFillSignal style={{ color: 'red', animation: 'glow 1s infinite' }} />;
    } else if (priority === 2) {
      return <AiFillSignal style={{ color: 'black', animation: 'glow 1s infinite' }} />;
    } else if (priority === 1) {
      return <AiFillSignal style={{ color: 'green', animation: 'glow 1s infinite' }} />;
    } else {
      return <AiOutlineClose style={{ color: 'orange', animation: 'glow 1s infinite' }} />;
    }
  };


  return (
    <div className="card">
      <div style={{ position: "relative" }}>
  <img     style={{
      position: "absolute",
      top: 0,
      right: 0,
      width: "30px",
      height: "30px",
      borderRadius: "50%",
      margin: "3px",
    }}
    src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg"
  />
  <span style={{textTransform : "uppercase", left:0,top:0}} className='color-grey'>{ticket.id}</span>

</div>
      
      <div className="cardContainer flex-gap-10" style={{ gap: '5px' }}>
        <div className="cardHeading flex-sb">
          <div className="card-content">
            <h3>{ticket.title}</h3>
            <p>{ticket.description}</p>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <div className="card-priority-icon">{getPriorityIcon(ticket.priority)}</div>
        <div className="tag">{ticket.tag}</div>
      </div>
    </div>
  );
};

export default Card;