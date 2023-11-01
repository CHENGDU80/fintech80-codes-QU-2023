const API_KEY = 'fedb9704-3268-4f47-b741-efc07c31b326';
const BASE_URL = 'https://eventregistry.org/api/v1/article/getArticles?';
const requirement = 'https://eventregistry.org/api/v1/article/getArticles?categoryUri=dmoz/Business&resultType=articles&articlesSortBy=date&articlesCount=10&apiKey=442b2a29-cec7-4ada-bc2f-edc4f56aaa5f';
//https://eventregistry.org/api/v1/article/getArticles?categoryUri=dmoz/Business&resultType=articles&articlesSortBy=date&articlesCount=190&apiKey=442b2a29-cec7-4ada-bc2f-edc4f56aaa5f
export const getLatestNews = async (queryParams) => {
  try {
    //let queryParams = `categoryUri=dmoz/Business&resultType=articles&articlesSortBy=date&articlesCount=10&`;
    //const response = await fetch(`${BASE_URL}${queryParams}&apiKey=${API_KEY}`); categoryUri=dmoz/Business&
    const response = await fetch(queryParams);
    //const response = await fetch(`${BASE_URL}${queryParams}apikey=${API_KEY}`);
    //const response = await fetch(requirement);
    //const response = await fetch(`${BASE_URL}/news?apikey=${API_KEY}&size=5&category=business&prioritydomain=top&language=zh,en&full_content=1&timeframe=15m`);
    const data = await response.json();
    // Save the JSON data to a file in the current directory
    return data;
  } catch (error) {
    console.error('Error fetching news:', error);
    return null;
  }
};
