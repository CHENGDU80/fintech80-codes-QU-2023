// pages/news.js
import React, { useContext } from 'react';
import { WebSocketContext } from '../services/outputAPI'; // Import the context

const LLM_output = () => {
  const { articles } = useContext(WebSocketContext); // Use the context to access articles

  return (
    <div style={{ display: 'flex', flexDirection: 'column-reverse', marginTop: '64px' /* Adjust the padding to match your navbar's height */ }}>
      {/* Render articles here */}
      {articles.map((data, index) => (
        <div key={index}>
          {/* Render your article data */}
          <h2>{data.headline}</h2>
          <p>{data.content}</p>
        </div>
      ))}
    </div>
  );
};

export default LLM_output;