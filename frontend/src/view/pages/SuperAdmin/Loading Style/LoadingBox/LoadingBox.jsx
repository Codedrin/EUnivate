import React from 'react';
import styles from './LoadingBox.module.css'; // Import the CSS module

const LoadingBox = () => {
  return (
    <div className={styles.loadingBox}>
      <div className={styles.loadingAnimation}>
        <svg viewBox="0 0 50 50">
          <circle className={styles.ring} cx="25" cy="25" r="20"></circle>
          <circle className={styles.ball} cx="25" cy="5" r="3.5"></circle>
        </svg>
      </div>
    </div>
  );
};

export default LoadingBox;
