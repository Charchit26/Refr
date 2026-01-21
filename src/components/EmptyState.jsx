import { motion } from 'framer-motion';
import { HiMagnifyingGlass, HiPlus } from 'react-icons/hi2';
import './EmptyState.css';

function EmptyState({ hasFilter, onClearFilter, onAddClick }) {
  return (
    <motion.div 
      className="empty-state"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="empty-icon">
        {hasFilter ? <HiMagnifyingGlass /> : '🎁'}
      </div>
      
      <h3>
        {hasFilter 
          ? 'No codes found for this app'
          : 'No referral codes yet'
        }
      </h3>
      
      <p>
        {hasFilter
          ? 'Try selecting a different app or clear the filter'
          : 'Be the first to share a referral code and help others save!'
        }
      </p>

      <div className="empty-actions">
        {hasFilter && (
          <motion.button
            className="empty-btn secondary"
            onClick={onClearFilter}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Clear Filter
          </motion.button>
        )}
        
        <motion.button
          className="empty-btn primary"
          onClick={onAddClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <HiPlus />
          <span>Add First Code</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

export default EmptyState;
