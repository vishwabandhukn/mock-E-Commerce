import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export default function Toast({ message, type = 'info', duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 100);
    
    // Auto close after duration
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  const getTypeClass = () => {
    switch (type) {
      case 'success':
        return 'toast--success';
      case 'error':
        return 'toast--error';
      case 'warning':
        return 'toast--warning';
      default:
        return 'toast--info';
    }
  };

  if (!isVisible && !isExiting) return null;

  return (
    <div className={`toast ${getTypeClass()} ${isVisible ? 'toast--visible' : ''} ${isExiting ? 'toast--exiting' : ''}`}>
      <div className="toast__icon">{getIcon()}</div>
      <div className="toast__content">
        <p className="toast__message">{message}</p>
      </div>
      <button className="toast__close" onClick={handleClose}>×</button>
    </div>
  );
}

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['info', 'success', 'error', 'warning']),
  duration: PropTypes.number,
  onClose: PropTypes.func,
};