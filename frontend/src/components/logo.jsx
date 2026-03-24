import React from 'react';

const Logo = () => {
  return (
    <div className="logo-container">
      <svg width="32" height="32" viewBox="0 0 32 32" className="logo-icon">
        <defs>
          <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e74c3c" />
            <stop offset="50%" stopColor="#c0392b" />
            <stop offset="100%" stopColor="#a93226" />
          </linearGradient>
          <linearGradient id="blackGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2c3e50" />
            <stop offset="50%" stopColor="#1a252f" />
            <stop offset="100%" stopColor="#0f1419" />
          </linearGradient>
        </defs>
        <path 
          d="M16 4C9.37 4 4 9.37 4 16s5.37 12 12 12 12-5.37 12-12S22.63 4 16 4z" 
          fill="url(#blackGrad)" 
          stroke="url(#redGrad)" 
          strokeWidth="1.5"
        />
        <circle cx="16" cy="16" r="7" fill="none" stroke="url(#redGrad)" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="16" cy="16" r="3" fill="#e74c3c"/>
        <path d="M24 8l-4 4M8 24l4-4M24 24l-4-4M8 8l4 4" stroke="url(#redGrad)" strokeWidth="2" strokeLinecap="round" fill="none"/>
      </svg>
      <span className="logo-text">
        <span className="accent-z">Z</span>oomi
      </span>
    </div>
  );
};

export default Logo;

const styles = `
.logo-container {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 1.125rem;
  font-weight: 800;
  color: #2c3e50;
  letter-spacing: -0.03em;
  line-height: 1.2;
}

.logo-icon {
  flex-shrink: 0;
  filter: drop-shadow(0 2px 8px rgba(231, 76, 60, 0.4));
  transition: transform 0.3s ease;
}

.logo-container:hover .logo-icon {
  transform: rotate(180deg) scale(1.08);
}

.logo-text {
  font-size: 1em;
}

.accent-z {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 900;
}

@media (max-width: 768px) {
  .logo-container {
    top: 0.75rem;
    left: 0.75rem;
    padding: 0.5rem 0.875rem;
    gap: 0.5rem;
    font-size: 1rem;
    border-radius: 12px;
  }
  
  .logo-icon {
    width: 24px !important;
    height: 24px !important;
  }
  
  .logo-text {
    font-size: 0.95em;
  }
}

@media (max-width: 480px) {
  .logo-container {
    top: 0.5rem;
    left: 0.5rem;
    padding: 0.4rem 0.75rem;
    font-size: 0.95rem;
    gap: 0.4rem;
  }
  
  .logo-icon {
    width: 22px !important;
    height: 22px !important;
  }
}
`;

// Inject global styles (use unique class to avoid conflicts)
if (typeof document !== 'undefined') {
  const existingStyle = document.querySelector('style[data-logo]');
  if (!existingStyle) {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    styleSheet.setAttribute('data-logo', 'zoomi');
    document.head.appendChild(styleSheet);
  }
}

