import { motion } from 'framer-motion';
import { HiPlus } from 'react-icons/hi2';
import './Header.css';

function Header({ onAddClick }) {
  return (
    <motion.header 
      className="header"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container header-content">
        <a href="/" className="logo">
          <span className="logo-icon">R</span>
          <span className="logo-text">Refr</span>
        </a>

        <nav className="header-nav">
          <motion.button
            className="add-btn"
            onClick={onAddClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <HiPlus />
            <span>Add Code</span>
          </motion.button>
        </nav>
      </div>
    </motion.header>
  );
}

export default Header;
