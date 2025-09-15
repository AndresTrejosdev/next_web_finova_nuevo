import BlogLeftSidebar from '@/app/Components/Blog/BlogLeftSidebar';
import BreadCumb from '@/app/Components/Common/BreadCumb';
import React from 'react';

const page = () => {
  return (
    <div>
        <BreadCumb
                bgimg="/assets/images/bg/breadcumgBg.png"
                Title="Blog Left Sidebar"
            ></BreadCumb>   
            <BlogLeftSidebar></BlogLeftSidebar>       
    </div>
  );
};

export default page;