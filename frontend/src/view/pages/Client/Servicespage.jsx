import React from 'react'
import Services from '../../components/Client/LandingPage/Services.jsx';
import Navbar from '../../components/Client/LandingPage/Navbar.jsx';

import styles from '../../../style';  
const Servicespage = () => {
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
          <Services />  
        </div>
      </div>


      </div>
  )
}

export default Servicespage