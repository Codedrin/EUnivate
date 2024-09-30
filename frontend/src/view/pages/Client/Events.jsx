import React from 'react';
import EventsPage from '../../components/Client/LandingPage/EventsPage.jsx';
import Navbar from '../../components/Client/LandingPage/Navbar.jsx';
import styles from '../../../style';  

const Events = () => {
  return (
    <div className="bg-white w-full overflow-hidden">

      {/* Navbar with consistent spacing */}
      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Navbar />  
        </div>
      </div>

      {/* Webinar with consistent spacing */}
      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <EventsPage />  
        </div>
      </div>

    </div>
  );
}

export default Events;
