import React, { useState, useEffect } from 'react';
import { getLatestNews } from '../services/newsdataAPI';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, Collapse, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/system';

function NewsList() {
  const [news, setNews] = useState([]);
  const [newsData, setNewsData] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState(''); // default query
  const [latestDateTimePub, setLatestDateTimePub] = useState('2023-10-01T00:00:00Z'); // State to keep track of the latest article's publication date
  const [expanded, setExpanded] = React.useState(null);
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
  const stock_array = Array.from({ length: 4 }, (_, i) => `stock ${i + 1}`);
  
  const handleExpandClick = (index) => {
    setExpanded(expanded === index ? null : index);
  };
//&dateEnd=2023-10-25
  const fetchData = async () => {
    setLoading(true);
  
    const queryParams = 'https://eventregistry.org/api/v1/article/getArticles?resultType=articles&articlesSortBy=date&articlesCount=5&lang=eng&apiKey=fedb9704-3268-4f47-b741-efc07c31b326';
  
    const data = await getLatestNews(queryParams);
  
    if (data && data.articles && data.articles.results) {
      const newArticles = data.articles.results.filter(article => {
        // Filter articles based on dateTimePub and ensure they're not already in the state
        return article.dateTimePub > latestDateTimePub && 
               !news.some(prevArticle => prevArticle.uri === article.uri);
      });
  
      if (newArticles.length > 0) {
        const mostRecentDateTimePub = newArticles[0].dateTimePub;
        
        setLatestDateTimePub(mostRecentDateTimePub); // Move this line before setNews
        setNews(prevNews => [...prevNews, ...newArticles]);
      }      
    }
  
    setLoading(false);
  };
  
  useEffect(() => {
    if (news.length > 0) { // or any other condition you deem necessary
        handleAnalyzeNews();
    }
  }, [news]); // This effect will run every time the news state changes

  const handleAnalyzeNews = async () => {
    try {
        const response = await fetch('http://localhost:8000/process-news', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newsData: news })
        });
        const data = await response.json();

        setNewsData(data);  // Set the data in local state or context

        // Store the data in localStorage
        localStorage.setItem('newsData', JSON.stringify(data));

        // Update the URL without navigating
        const newUrl = `/output_page?newsData=${encodeURIComponent(JSON.stringify(data))}`;
        window.history.pushState({}, '', newUrl);

    } catch (error) {
        console.error('Error notifying backend:', error);
    }
};


  const handle_go_to_output = () => {
    router.push('/output_page');
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '2em', fontWeight: 'bold', marginRight: '20px' }}>Latest News</h1>
        <input 
          type="text" 
          value={query} 
          onChange={e => setQuery(e.target.value)}
          placeholder="Search for news..."
          sx={{
            bgcolor: 'secondary.main',
            borderRadius: 4,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#000000',
              },
              '&:hover fieldset': {
                borderColor: '#000000',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#000000',
              },
            },
          }}
        />
        <button onClick={fetchData} style={{ marginLeft: '10px' }}>Search</button>
        <button onClick={handle_go_to_output} disabled={news.length === 0}>
        Analyze News
        </button>
      </div>
      {loading && <div>Loading...</div>}
      {!loading && (
        <ul>
          {news.map((item, index) => (
              <StyledCard 
                variant="outlined" 
                key={index}
              >
              <CardHeader
                title={<a href={item.link} target="_blank" rel="noopener noreferrer">{item.title}</a>}
                subheader={
                  <>
                    {`Date published: ${item.dateTimePub}`}
                  </>
                }
                action={
                  <IconButton onClick={() => handleExpandClick(index)}>
                    <ExpandMoreIcon />
                  </IconButton>
                }
              />
              <Collapse in={expanded === index} timeout="auto" unmountOnExit>
                <CardContent>
                  {item.body && <p><strong>Description </strong> {item.body}</p>}
                  {/* Uncomment and use other details as needed */}
                  {/* ... */}
                </CardContent>
              </Collapse>
              </StyledCard>
          ))}
        </ul>
        )}
    </div>
  );

}

export default React.memo(NewsList);