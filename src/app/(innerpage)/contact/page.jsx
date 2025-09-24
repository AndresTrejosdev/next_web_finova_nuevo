import BreadCumb from '@/app/Components/Common/BreadCumb';
import ContactInfo from '@/app/Components/ContactInfo/ContactInfo';
import React from 'react';

const page = () => {
  return (
    <div>
             <BreadCumb
                bgimg="/assets/images/bg/breadcumgBg.png"
                Title="Contacto"
            ></BreadCumb> 
            <ContactInfo></ContactInfo>        
    </div>
  );
};

export default page;