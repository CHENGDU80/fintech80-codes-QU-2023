// WebSocketContext.js
import React, { createContext, useState, useEffect, useRef } from 'react';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [articles, setArticles] = useState([]);
  const indexRef = useRef(0); // Create a ref for the index
  const fakeData = [
    {
      "article": {
        "timestamp": "09:15",
        "headline": "Tech giants to merge in historic deal",
        "content": "In a surprising turn of events, two leading tech companies announced their intentions to merge. CEO James Thompson remarked: 'This merger will redefine the tech landscape, bringing together the best of both worlds. We anticipate a brighter future for our stakeholders.'"
      },
      "reliability_rating": 4,
      "market_sentiment_impact_score": 0.9,
      "sentiment_analysis": {
        "overall_sentiment": "positive"
      }
    },
    {
      "article": {
        "timestamp": "11:43",
        "headline": "Natural disaster strikes South America",
        "content": "A major earthquake has hit the western coast, causing significant damage and loss of life. Rescue operations are underway, with international aid pouring in."
      },
      "reliability_rating": 5,
      "market_sentiment_impact_score": -0.8,
      "sentiment_analysis": {
        "overall_sentiment": "negative"
      }
    },
    {
      "article": {
        "timestamp": "16:28",
        "headline": "Breakthrough in cancer research announced",
        "content": "Scientists from the Global Health Institute have unveiled a potential treatment for a rare form of cancer. Early trials show promising results, sparking hope worldwide."
      },
      "reliability_rating": 5,
      "market_sentiment_impact_score": 0.6,
      "sentiment_analysis": {
        "overall_sentiment": "positive"
      }
    },
    {
      "article": {
        "timestamp": "12:57",
        "headline": "Political unrest escalates in North Africa",
        "content": "Protests have intensified, with citizens demanding governmental reforms. The international community urges dialogue to restore peace."
      },
      "reliability_rating": 3,
      "market_sentiment_impact_score": -0.5,
      "sentiment_analysis": {
        "overall_sentiment": "negative"
      }
    },
    {
      "article": {
        "timestamp": "15:32",
        "headline": "Innovative green energy solutions unveiled",
        "content": "At the annual Energy Summit, new sustainable energy technologies were showcased, marking a potential shift towards cleaner energy sources."
      },
      "reliability_rating": 4,
      "market_sentiment_impact_score": 0.7,
      "sentiment_analysis": {
        "overall_sentiment": "positive"
      }
    },
    {
      "article": {
        "timestamp": "10:21",
        "headline": "Financial markets experience volatility",
        "content": "Stock markets witnessed sharp fluctuations today, with analysts attributing the instability to geopolitical tensions and economic uncertainties."
      },
      "reliability_rating": 4,
      "market_sentiment_impact_score": -0.6,
      "sentiment_analysis": {
        "overall_sentiment": "negative"
      }
    },
    {
      "article": {
        "timestamp": "13:45",
        "headline": "Celebrated author releases new novel",
        "content": "Bestselling author, Lydia Martin, has released her much-anticipated novel, receiving rave reviews from critics and fans alike."
      },
      "reliability_rating": 3,
      "market_sentiment_impact_score": 0.2,
      "sentiment_analysis": {
        "overall_sentiment": "positive"
      }
    },
    {
      "article": {
        "timestamp": "17:18",
        "headline": "Major airline faces backlash over incident",
        "content": "Controversy surrounds a leading airline after an onboard incident went viral. The company is now in damage control, addressing concerns and ensuring passenger safety."
      },
      "reliability_rating": 2,
      "market_sentiment_impact_score": -0.7,
      "sentiment_analysis": {
        "overall_sentiment": "negative"
      }
    },
    {
      "article": {
        "timestamp": "08:59",
        "headline": "Breakthrough in AI technology",
        "content": "Tech firm, NeuralTech, has unveiled its latest AI model, promising faster computations and enhanced user experiences. The tech community is abuzz with excitement."
      },
      "reliability_rating": 5,
      "market_sentiment_impact_score": 0.8,
      "sentiment_analysis": {
        "overall_sentiment": "positive"
      }
    },
    {
      "article": {
        "timestamp": "14:03",
        "headline": "Sports team faces major upset",
        "content": "In a shocking turn of events, the top-ranked team faced a crushing defeat in yesterday's match, leaving fans and analysts in disbelief."
      },
      "reliability_rating": 3,
      "market_sentiment_impact_score": -0.3,
      "sentiment_analysis": {
        "overall_sentiment": "negative"
      }
    }
  ];
// In WebSocketProvider's useEffect

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (indexRef.current < fakeData.length) {
        const newArticle = fakeData[indexRef.current];
        setArticles(prevArticles => [...prevArticles, newArticle.article]);
        //console.log("The index is ", indexRef.current);
        //console.log(newArticle); // Print the newArticle to the console
        indexRef.current += 1; // Increment the current value of the ref
      } else {
        clearInterval(intervalId); // Clear the interval once all data is sent
      }
    }, 5000); // Send a new article every 10000ms (10 seconds)

    return () => {
      clearInterval(intervalId);
    };
  }, [fakeData]); // The ref does not need to be a dependency

  return (
    <WebSocketContext.Provider value={{ articles }}>
      {children}
    </WebSocketContext.Provider>
  );
};
