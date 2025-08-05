import React from 'react';
import '../../App.css'; // or use inline/tailwind if preferred

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Online Voting System. All rights reserved.</p>
        {/* <p>
          Developed by <a href="https://your-portfolio.com" target="_blank" rel="noopener noreferrer">Your Name</a>
        </p>
        <p>Contact: <a href="mailto:support@votingsystem.com">support@votingsystem.com</a></p> */}
      </div>
    </footer>
  );
};

export default Footer;
