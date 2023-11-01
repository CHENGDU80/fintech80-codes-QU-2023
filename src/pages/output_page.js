import LLM_output from '../components/LLM_output';
import NavBar from '../components/NavBar';

import React from 'react';

const output_page = () => {
  return (
    <div>
        <NavBar/>
        <div className="main-content">
          <LLM_output/> 
        </div>
    </div>
  );
};


output_page.getLayout = (page) => (
  <div>
    {page}
  </div>
);

export default output_page;
