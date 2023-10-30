import React, { useState } from 'react';
import Card from './Card';

function Page({ cards }) {
  const [cardList, setCardList] = useState(cards);

  const addNewCard = (title, description, status) => {
    const newCard = { title, description, status };
    setCardList([...cardList, newCard]);
  };

  return (
    <div className="page">
      <h1>Card Page</h1>
      <div>
        <button
          onClick={() =>
            addNewCard('New Card', 'This is a new card.', 'To Do')
          }
        >
          Add New Card
        </button>
      </div>
      <div className="card-container">
        {cardList.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
    </div>
  );
}

export default Page;
