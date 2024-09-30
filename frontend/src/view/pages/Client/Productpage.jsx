
import React from 'react'
import Product from '../../components/Client/LandingPage/Products.jsx';
import Navbar from '../../components/Client/LandingPage/Navbar.jsx';

import styles from '../../../style';  
const Productpage = () => {
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
          <Product />  
        </div>
      </div>


      </div>
  )
}

export default Productpage