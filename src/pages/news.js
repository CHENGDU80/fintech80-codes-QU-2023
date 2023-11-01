import News from '../components/NewsList';
import NavBar from '../components/NavBar';

import React from 'react';

const NewsPage = () => {
  return (
    <div>
        <NavBar />
        <div className="main-content"> {/* Apply the main-content class here */}
            <News/>
        </div>
    </div>
  );
};

NewsPage.getLayout = (page) => (
  <div>
    {page}
  </div>
);

export default NewsPage;
