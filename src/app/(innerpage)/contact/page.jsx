import BreadCumb from '../../Components/Common/BreadCumb';
import ContactInfo from '../../Components/ContactInfo/ContactInfo';
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