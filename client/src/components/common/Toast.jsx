import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSpinner, faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import './Toast.css';

const Toast = ({ 
  message, 
  type = 'loading', // 'loading', 'error', 'success'
  duration = 5000, 
  onClose 
}) => {
  const [progress, setProgress] = useState(100);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateProgress = () => {
      const now = Date.now();
      const remaining = endTime - now;
      const newProgress = (remaining / duration) * 100;

      if (remaining <= 0) {
        setIsVisible(false);
        if (onClose) onClose();
      } else {
        setProgress(newProgress);
        requestAnimationFrame(updateProgress);
      }
    };

    const animationFrame = requestAnimationFrame(updateProgress);

    return () => cancelAnimationFrame(animationFrame);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'loading':
        return <FontAwesomeIcon icon={faSpinner} className="spin" />;
      case 'error':
        return <FontAwesomeIcon icon={faExclamationCircle} />;
      case 'success':
        return <FontAwesomeIcon icon={faCheckCircle} />;
      default:
        return null;
    }
  };

  return (
    <div className={`toast-notification ${type}`}>
      <div className="toast-content">
        <div className="toast-icon">
          {getIcon()}
        </div>
        <div className="toast-message">{message}</div>
        <button className="toast-close" onClick={() => onClose()}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
      <div className="toast-progress">
        <div 
          className="toast-progress-bar" 
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  );
};

export default Toast; 