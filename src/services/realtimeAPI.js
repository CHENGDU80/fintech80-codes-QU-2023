import React, { useEffect } from 'react';
const WebSocket = require('ws'); // You need to install ws via npm if running in Node.js
const API_KEY = 'ckvhre1r01qq199itqjgckvhre1r01qq199itqk0';
const FINNHUB_BASE_URL = 'wss://ws.finnhub.io?token=';

export const realtime_news = () => {
    useEffect(() => {
        // Create a new WebSocket instance
    const ws = new WebSocket(FINNHUB_BASE_URL + API_KEY);

    ws.on('open', () => {
      // Subscribe to the financial news topic
      ws.send(JSON.stringify({'type':'subscribe', 'symbol': 'TESLA'}));
    });

    ws.on('message', (data) => {
      // Handle incoming data
      console.log(data);
    });

    ws.on('error', (error) => {
      console.error('WebSocket Error:', error);
    });
    
    // Save the JSON data to a file in the current directory
    // Clean up the WebSocket connection when the component unmounts
    return (data.json()) => ws.close();
  }, []);

  return (
    <div>
      {/* Render your news component here */}
    </div>
  );
};

