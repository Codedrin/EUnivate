import React from 'react';
import ShowcasePage from '../../components/Client/Dropdowns/Showcase.jsx';
import Navbar from '../../components/Client/LandingPage/Navbar.jsx';
import styles from '../../../style';  

const ShowcasesPage = () => {
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
          <ShowcasePage />  
        </div>
      </div>

    </div>
  );
}

export default ShowcasesPage;
