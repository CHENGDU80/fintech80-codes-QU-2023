import LLM_output from '../components/LLM_output';
import NavBar from '../components/NavBar';

import React from 'react';

const output_page = () => {
  return (
    <div>
        <NavBar/>
        <LLM_output/>
    </div>
  );
};

output_page.getLayout = (page) => (
  <div>
    {page}
  </div>
);

export default output_page;
