import React from 'react';
import UserIcon from '@heroicons/react/24/solid/UserIcon';


const teamMembers = [
  {
    id: 1,
    name: 'Jane Smith',
    position: 'CTO',
    imageSrc: '/images/cat.jpg',
  },
  {
    id: 2,
    name: 'Jane Smith',
    position: 'CTO',
    imageSrc: '/images/cat.jpg',
  },
  {
    id: 3,
    name: 'John Doe',
    position: 'CEO',
    imageSrc: '/images/cat.jpg',
  }];

function Event(props) {
  const { title, description, numOfXXX, teamMember } = props; // 从 props 中获取数据
  console.log(" Event的值是:", props);
  return (
    <div className="app">
      <div className="sidebar">
        <div className="logo"> PathFinder
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <UserIcon />
          </svg>
        </div>
        <div className="message">
          <h3>Event Name: {title}</h3> {/* 使用 props 中的 title */}
          <p>Summary: {description}</p> {/* 使用 props 中的 description */}
        </div>
        <div className="footer">
          <p>Num of {title}: {numOfXXX}</p> {/* 使用 props 中的 numOfXXX */}
        </div>
    </div>

    <div className="impact-container">
      <h1 className="h1-impact">Impact Title</h1>
      <p className="p-impact">Impact description goes here.</p>

      <div className="team-members">
        {teamMembers.map((member) => (
          <div className="member-card" key={member.id}>
            <div className="member-name">{member.name}</div>
            <div className="member-position">{member.position}</div>
            <img
              src={member.imageSrc}
              alt={`${member.name}'s Photo`}
              className="member-image"
            />
          </div>
        ))}
      </div>
    </div>

    
    </div>
  );
}

export default Event;