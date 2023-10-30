import React, { useState, useEffect } from 'react';
import fetchData from '../services/api';
import Card from './Card';
import './KanbanBoard.css';
import { FaList, FaPlus, FaSort } from 'react-icons/fa';
import { AiFillSignal, AiOutlineClose } from 'react-icons/ai';

const KanbanBoard = () => {
  const initialSelectedGroup = localStorage.getItem('selectedGroup') || 'status';
  const initialSelectedSort = localStorage.getItem('selectedSort') || 'priority';

  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(initialSelectedGroup);
  const [selectedSort, setSelectedSort] = useState(initialSelectedSort);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchData();
        setTickets(data.tickets);
        setUsers(data.users);
        localStorage.setItem('tickets', JSON.stringify(data.tickets));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    localStorage.setItem('tickets', JSON.stringify(tickets));
    localStorage.setItem('selectedGroup', selectedGroup);
    localStorage.setItem('selectedSort', selectedSort);
  }, [tickets, selectedGroup, selectedSort]);

  const groupTickets = () => {
    if (selectedGroup === 'status') {
      return tickets.reduce((acc, ticket) => {
        acc[ticket.status] = acc[ticket.status] || [];
        acc[ticket.status].push(ticket);
        return acc;
      }, {});
    } else if (selectedGroup === 'userId') {
      return tickets.reduce((acc, ticket) => {
        const userName = users.find((user) => user.id === ticket.userId)?.name || 'Unassigned';
        acc[userName] = acc[userName] || [];
        acc[userName].push(ticket);
        return acc;
      }, {});
    } else if (selectedGroup === 'priority') {
      return tickets.reduce((acc, ticket) => {
        const priorityMap = {
          4: 'Urgent',
          3: 'High',
          2: 'Medium',
          1: 'Low',
          0: 'No priority',
        };
        const priorityName = priorityMap[ticket.priority];
        acc[priorityName] = acc[priorityName] || [];
        acc[priorityName].push(ticket);
        return acc;
      }, {});
    }
  };

  const sortTickets = (groupedTickets) => {
    if (selectedSort === 'priority') {
      Object.keys(groupedTickets).forEach((key) => {
        const priorityOrder = { Urgent: 4, High: 3, Medium: 2, Low: 1, 'No priority': 0 };
        groupedTickets[key].sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
      });
    } else if (selectedSort === 'title') {
      Object.keys(groupedTickets).forEach((key) => {
        groupedTickets[key].sort((a, b) => a.title.localeCompare(b.title));
      });
    }
  };

  const groupedTickets = groupTickets();
  sortTickets(groupedTickets);

  const getProfileIcon = (userName) => {
    if (selectedGroup === 'status' || selectedGroup === 'title') {
      return null; 
    }

    const initials = userName.split(' ').map((name) => name[0].toUpperCase()).join('');
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    const backgroundColor = "#" + randomColor;

    return (
      <div className="profile-icon">
        <div
          style={{
            backgroundColor: backgroundColor,
            width: '36px',
            height: '36px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '50%',
          }}
        >
          <span style={{ color: 'white', fontWeight: 'bold' }}>{initials}</span>
        </div>
        <span className="user-name" style={{ marginLeft: '20px' }}>
          {userName}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px', marginLeft: '82px' }}>
          <FaPlus style={{ color: 'black', marginRight: '15px' }} />
          <FaSort style={{ color: 'black' }} />
        </div>
      </div>
    );
  };

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

  const getEmojiForStatus = (status) => {
    switch (status) {
      case 'In progress':
        return <span style={{ marginBottom: '9px', fontSize: '24px' }}>🕣</span>;
      case 'Todo':
        return <span style={{ marginBottom: '9px', fontSize: '24px' }}>📝</span>;
      case 'Done':
        return <span style={{ marginBottom: '9px', fontSize: '24px' }}>✅</span>;
      case 'Backlog':
        return <span style={{ marginBottom: '9px', fontSize: '24px' }}>🛑</span>;
        case 'cancelled':
          return <span style={{ marginBottom: '9px', fontSize: '24px' }}>❌</span>;  
      default:
        return <span style={{ marginBottom: '9px', fontSize: '24px' }}>❗</span>;
    }
  };

  const countCardsForStatusGroup = (statusGroup) => {
    return groupedTickets[statusGroup] ? groupedTickets[statusGroup].length : 0;
  };

  return (
    <div className="kanban-board-container">
      <div className="navbar">
        <div className="dropdown">
          <button className="dropbtn">
            <FaList style={{ marginRight: '5px' }} /> Display
          </button>
          <div className="dropdown-content">
            <div className="dropdown-item">
              <span>Group By</span>
              <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                <option value="status">Status</option>
                <option value="userId">User</option>
                <option value="priority">Priority</option>
              </select>
            </div>
            <div className="dropdown-item">
              <span>Order By</span>
              <select value={selectedSort} onChange={(e) => setSelectedSort(e.target.value)}>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="kanban-board">
        {Object.keys(groupedTickets).map((key) => (
          <div key={key} className="ticket-column">
            {selectedGroup === 'status' && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {getEmojiForStatus(key)}
                <h2 style={{ marginLeft: '10px', marginBottom: '14px' }}>{key}</h2>
  <h3 style={{ color: 'black', fontSize: '20px', marginLeft:'15px' }}>{countCardsForStatusGroup(key)}</h3>

                <span style={{ marginLeft: 'auto' }}>
                  <FaPlus style={{ color: 'black', marginRight: '15px' }} />
                  <FaSort style={{ color: 'black' }} />
                </span>
              </div>
            )}
            {selectedGroup !== 'status' && selectedGroup !== 'title' && (
              <div className="user-icon" style={{display: 'flex', alignItems: 'center' }}>
                {selectedGroup !== 'priority' && getProfileIcon(key)}
                {selectedGroup !== 'userId' && (
                  <h2 style={{ marginRight: '20px' }}>
                    {key !== 'Unassigned' ? key : 'Unassigned'}
                  </h2>
                )}
                {selectedGroup === 'priority' && (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h2 style={{ marginRight: '120px' }}>{countCardsForStatusGroup(key)}</h2>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <FaPlus style={{ color: 'black' }} />
                      <FaSort style={{ color: 'black', marginLeft: '15px' }} />
                    </div>
                  </div>
                )}
              </div>
            )}
            {groupedTickets[key].map((ticket) => (
              <Card
                key={ticket.id}
                ticket={ticket}
                icon={selectedGroup === 'priority' ? getPriorityIcon(ticket.priority) : null}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
