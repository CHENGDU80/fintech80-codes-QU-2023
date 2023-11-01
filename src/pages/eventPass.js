// Main.js
import React from 'react';
import { Event } from './event.js'; // 假设 Event 组件位于同一目录下
import { eventData } from './eventData.js'; // 导入数据

function eventPass() {
  console.log(" EventPass的值是:", eventData);
  return (
    <div>
      <Event
  title="Title 1"
  description="Description 1"
  numOfXXX={10}
  teamMembers={eventData.teamMembers || []} // 传递 teamMembers 属性
/>

    </div>
  );
}
export default eventPass;
