import React from 'react';
import Header4 from '../Components/Header/Header4';
import Footer from '../Components/Footer/Footer';
import GoogleAnalytics from '../Components/Analytics/GoogleAnalytics';
import GoogleTagManager from '../Components/Analytics/GoogleTagManager';

const DefalultLayout = ({ children }) => {
    return (
        <div className='main-page-area'>
            <Header4></Header4>
            <GoogleAnalytics GA_MEASUREMENT_ID="G-XXXXXXXXXX" />
            <GoogleTagManager GTM_ID="GTM-XXXXXXX" />
            <noscript>
                <iframe
                    src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
                    height="0"
                    width="0"
                    style={{ display: 'none', visibility: 'hidden' }}
                />
            </noscript>
            {children}
            <Footer></Footer>
        </div>
    );
};

export default DefalultLayout;