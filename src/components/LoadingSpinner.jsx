import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', text }) => {
  const sizeClass = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  }[size];

  return (
    <div className="loading-spinner-container" role="status">
      <div className={`loading-spinner ${sizeClass}`}></div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;