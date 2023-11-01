import React, { useContext, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, Collapse, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import { styled } from '@mui/system';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function downloadObjectAsJson(exportObj, exportName) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

function ImageModal({ src, onClose }) {
  return (
      <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
      }}>
          <img src={src} alt="Graph" style={{ width: '95%', height: '95%' }} />
          <button onClick={onClose} style={{ position: 'absolute', top: 10, right: 10 }}>Close</button>
      </div>
  );
}

// Function to fetch and display the news
function LLM_output() {
  const [showPDFImage, setShowPDFImage] = useState(false);
  const [pdfImageSrc, setPdfImageSrc] = useState(null);
  const router = useRouter();
  // Try to get data from the router query first
  let newsData = JSON.parse(router.query.newsData || '{}');
  // If no data in the router query, try to get it from localStorage
  if (!newsData || Object.keys(newsData).length === 0) {
      newsData = JSON.parse(localStorage.getItem('newsData') || '{}');
  }
  const StyledCard = styled(Card)(({ theme }) => ({
    marginBottom: '16px',
    padding: '10px',
    transition: 'transform 0.3s, background-color 0.3s, box-shadow 0.3s, border 0.3s',
    '&:hover': {
      transform: 'scale(1.02) ',
      backgroundColor: '#e1fdd8',
      boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
      border: '1px solid #bdbdbd'
    }
  }));
  const [expanded, setExpanded] = useState(null);
  const handleExpandClick = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  const handle_graph = () => {
    const localImageUrl = '/images/graph.jpg'; // Adjusted path
    setPdfImageSrc(localImageUrl);
    setShowPDFImage(true);
}


  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '2em', fontWeight: 'bold', marginRight: '20px' }}>Events</h1>
        <button onClick={handle_graph}>Knowledge Graph of Event</button>
        {showPDFImage && <ImageModal src={pdfImageSrc} onClose={() => setShowPDFImage(false)} />}
      </div>
    
      {Object.keys(newsData).map((headline, index) => {
        const eventDetails = newsData[headline];
        return (
          <StyledCard key={index}>
            <CardHeader
                title={headline} // Just display the headline without the "Title:" prefix
                action={
                    <IconButton onClick={() => handleExpandClick(index)}>
                        <ExpandMoreIcon />
                    </IconButton>
                }
            >
            </CardHeader>
            <Collapse in={expanded === index} timeout="auto" unmountOnExit>
                <CardContent>
                  <h3>Summary:</h3>
                  <p>{eventDetails.Summary}</p>
                  <h3>Properties:</h3>
                  <ul>
                    {Object.entries(eventDetails.Properties).map(([key, value], propIndex) => (
                      <li key={propIndex}>{key}: {value}</li>
                    ))}
                  </ul>
                </CardContent>
            </Collapse>
          </StyledCard>
        );
      })}       
    </div>
  );
}

export default LLM_output;
